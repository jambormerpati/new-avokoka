import {
  blokOptions,
  dateToday,
  esc,
  formToObject,
  getBlok,
  getPohon,
  html,
  layout,
  num,
  pohonOptions,
  redirect,
} from "./core.js";

import {
  dbErrorPage,
  field,
  formButtons,
  insertCompatible,
  selectField,
  textareaField,
} from "./helpers-db.js";

// 37. MODUL PEMUPUKAN
// ============================================================

async function pemupukanList(env){

  const result =
    await env.DB
      .prepare(`
        SELECT
          pu.*,
          p.kode_pohon,
          p.varietas
        FROM pemupukan pu
        LEFT JOIN pohon p
          ON p.id=pu.pohon_id
        ORDER BY pu.tanggal DESC
      `)
      .all();

  const rows =
    result.results || [];


  const tableRows =
    rows.length
      ? rows.map(r => `

          <tr>

            <td>
              ${esc(r.tanggal || "-")}
            </td>

            <td>
              ${esc(r.kode_pohon || "-")}
            </td>

            <td>
              ${esc(r.pupuk || "-")}
            </td>

            <td>
              ${esc(r.jenis_pupuk || "-")}
            </td>

            <td>
              ${esc(r.dosis || "-")}
            </td>

            <td>
              ${
                r.jumlah_kg !== null &&
                r.jumlah_kg !== undefined
                  ? `${esc(r.jumlah_kg)} kg`
                  : "-"
              }
            </td>

            <td>
              ${
                r.jumlah_liter !== null &&
                r.jumlah_liter !== undefined
                  ? `${esc(r.jumlah_liter)} L`
                  : "-"
              }
            </td>

            <td>
              ${esc(r.metode || "-")}
            </td>

            <td>

              <a
                href="/pemupukan/${encodeURIComponent(r.id)}/edit"
                class="btn btn-secondary btn-sm"
              >
                ✏️ Edit
              </a>

            </td>

          </tr>

        `).join("")
      : `
          <tr>
            <td colspan="9" class="empty">
              Belum ada data pemupukan.
            </td>
          </tr>
        `;


  const content = `

    <div class="page-title">

      <div>

        <h1>🧪 Pemupukan</h1>

        <p>
          Riwayat aplikasi pupuk kebun
        </p>

      </div>

      <a
        href="/pemupukan/tambah"
        class="btn btn-primary"
      >
        ➕ Tambah Pemupukan
      </a>

    </div>


    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Tanggal</th>
              <th>Pohon</th>
              <th>Pupuk</th>
              <th>Jenis</th>
              <th>Dosis</th>
              <th>Jumlah kg</th>
              <th>Jumlah L</th>
              <th>Metode</th>
              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>
            ${tableRows}
          </tbody>

        </table>

      </div>

    </div>

  `;


  return layout(
    "Pemupukan",
    content,
    "pemupukan",
    "admin"
  );
}


// ============================================================
// 38. FORM PEMUPUKAN
// ============================================================

async function pemupukanForm(
  env,
  data = {},
  edit = false
){

  const [
    pohon,
    blok
  ] = await Promise.all([

    getPohon(env),
    getBlok(env)

  ]);


  const title =
    edit
      ? "Edit Pemupukan"
      : "Tambah Pemupukan";


  const content = `

    <div class="page-title">

      <div>

        <h1>🧪 ${title}</h1>

        <p>
          Pencatatan aplikasi pupuk
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/pemupukan/edit"
            : "/pemupukan/tambah"
        }"
      >

        <input
          type="hidden"
          name="id"
          value="${esc(data.id || "")}"
        >


        <div class="form-grid">


          ${selectField(
            "Pohon",
            "pohon_id",
            pohonOptions(
              pohon,
              data.pohon_id || ""
            ),
            data.pohon_id || ""
          )}


          ${selectField(
            "Blok",
            "blok_id",
            blokOptions(
              blok,
              data.blok_id || ""
            ),
            data.blok_id || ""
          )}


          ${field(
            "Tanggal",
            "tanggal",
            data.tanggal || dateToday(),
            "date",
            false,
            true
          )}


          ${field(
            "Pupuk",
            "pupuk",
            data.pupuk || "",
            "text",
            false,
            true
          )}


          ${field(
            "Jenis Pupuk",
            "jenis_pupuk",
            data.jenis_pupuk || ""
          )}


          ${field(
            "Dosis",
            "dosis",
            data.dosis || ""
          )}


          ${field(
            "Jumlah (kg)",
            "jumlah_kg",
            data.jumlah_kg || "",
            "number"
          )}


          ${field(
            "Jumlah (liter)",
            "jumlah_liter",
            data.jumlah_liter || "",
            "number"
          )}


          ${field(
            "Metode",
            "metode",
            data.metode || ""
          )}


          ${field(
            "Fase Tanaman",
            "fase_tanaman",
            data.fase_tanaman || ""
          )}


          ${field(
            "Operator",
            "operator",
            data.operator || ""
          )}


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            true
          )}

        </div>


        ${formButtons("/pemupukan")}

      </form>

    </div>

  `;


  return layout(
    title,
    content,
    "pemupukan",
    "admin"
  );
}


// ============================================================
// 39. CREATE PEMUPUKAN
// ============================================================
async function pemupukanCreate(
  request,
  env
){

  const data =
    await formToObject(request);


  if(!data.pohon_id){

    return html(
      layout(
        "Tambah Pemupukan",

        `
        <div class="card">

          <div class="notice notice-danger">
            Pohon wajib dipilih.
          </div>

          <a
            href="/pemupukan/tambah"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,

        "pemupukan",
        "admin"
      ),
      400
    );

  }


  try{

    await insertCompatible(
      env,
      "pemupukan",
      {

        // id sengaja tidak diisi
        // SQLite akan membuat ID otomatis

        pohon_id:
          Number(data.pohon_id),

        blok_id:
          data.blok_id !== ""
            ? Number(data.blok_id)
            : null,

        tanggal:
          data.tanggal || dateToday(),

        pupuk:
          data.pupuk || null,

        jenis_pupuk:
          data.jenis_pupuk || null,

        dosis:
          data.dosis || null,

        jumlah_kg:
          num(data.jumlah_kg),

        jumlah_liter:
          num(data.jumlah_liter),

        metode:
          data.metode || null,

        fase_tanaman:
          data.fase_tanaman || null,

        operator:
          data.operator || null,

        keterangan:
          data.keterangan || null

      }
    );


    return redirect(
      request,
      "/pemupukan"
    );


  }catch(err){

    return dbErrorPage(
      "Tambah Pemupukan",
      err,
      "/pemupukan/tambah"
    );

  }
}


// ============================================================
// 40. EDIT PEMUPUKAN PAGE
// ============================================================

async function pemupukanEditPage(
  env,
  id
){

  const data =
    await env.DB
      .prepare(`
        SELECT *
        FROM pemupukan
        WHERE id=?
        LIMIT 1
      `)
      .bind(id)
      .first();


  if(!data){

    return html(
      layout(
        "Pemupukan Tidak Ditemukan",

        `
        <div class="card">

          <div class="notice notice-danger">
            Data pemupukan tidak ditemukan.
          </div>

          <a
            href="/pemupukan"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,

        "pemupukan",
        "admin"
      ),
      404
    );

  }


  return pemupukanForm(
    env,
    data,
    true
  );
}


// ============================================================
// 41. UPDATE PEMUPUKAN
// ============================================================

async function pemupukanUpdate(
  request,
  env
){

  const data =
    await formToObject(request);


  try{

    await env.DB
      .prepare(`
        UPDATE pemupukan
        SET
          pohon_id=?,
          blok_id=?,
          tanggal=?,
          pupuk=?,
          jenis_pupuk=?,
          dosis=?,
          jumlah_kg=?,
          jumlah_liter=?,
          metode=?,
          fase_tanaman=?,
          operator=?,
          keterangan=?
        WHERE id=?
      `)
      .bind(

        data.pohon_id || null,

        data.blok_id || null,

        data.tanggal || dateToday(),

        data.pupuk || null,

        data.jenis_pupuk || null,

        data.dosis || null,

        num(data.jumlah_kg),

        num(data.jumlah_liter),

        data.metode || null,

        data.fase_tanaman || null,

        data.operator || null,

        data.keterangan || null,

        data.id

      )
      .run();


    return redirect(
      request,
      "/pemupukan"
    );


  }catch(err){

    return dbErrorPage(
      "Edit Pemupukan",
      err,
      `/pemupukan/${encodeURIComponent(data.id)}/edit`
    );

  }
}


// ============================================================


export {
  pemupukanCreate,
  pemupukanEditPage,
  pemupukanForm,
  pemupukanList,
  pemupukanUpdate,
};
