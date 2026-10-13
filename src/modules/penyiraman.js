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

// 42. MODUL PENYIRAMAN
// ============================================================

async function penyiramanList(env){

  const result =
    await env.DB
      .prepare(`
        SELECT
          ir.*,
          p.kode_pohon,
          p.varietas
        FROM penyiraman ir
        LEFT JOIN pohon p
          ON p.id=ir.pohon_id
        ORDER BY ir.tanggal DESC
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
              ${
                r.volume_liter !== null &&
                r.volume_liter !== undefined
                  ? `${esc(r.volume_liter)} L`
                  : "-"
              }
            </td>

            <td>
              ${
                r.durasi_menit !== null &&
                r.durasi_menit !== undefined
                  ? `${esc(r.durasi_menit)} menit`
                  : "-"
              }
            </td>

            <td>
              ${esc(r.metode || "-")}
            </td>

            <td>
              ${esc(r.sumber_air || "-")}
            </td>

            <td>
              ${esc(r.kondisi_cuaca || "-")}
            </td>

            <td>
              ${esc(r.operator || "-")}
            </td>

            <td>

              <a
                href="/penyiraman/${encodeURIComponent(r.id)}/edit"
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
              Belum ada data penyiraman.
            </td>
          </tr>
        `;


  const content = `

    <div class="page-title">

      <div>

        <h1>💧 Penyiraman</h1>

        <p>
          Riwayat penyiraman kebun
        </p>

      </div>

      <a
        href="/penyiraman/tambah"
        class="btn btn-primary"
      >
        ➕ Tambah Penyiraman
      </a>

    </div>


    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Tanggal</th>
              <th>Pohon</th>
              <th>Volume</th>
              <th>Durasi</th>
              <th>Metode</th>
              <th>Sumber Air</th>
              <th>Cuaca</th>
              <th>Operator</th>
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
    "Penyiraman",
    content,
    "penyiraman",
    "admin"
  );
}


// ============================================================
// 43. FORM PENYIRAMAN
// ============================================================

async function penyiramanForm(
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
      ? "Edit Penyiraman"
      : "Tambah Penyiraman";


  const content = `

    <div class="page-title">

      <div>

        <h1>💧 ${title}</h1>

        <p>
          Pencatatan penggunaan air kebun
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/penyiraman/edit"
            : "/penyiraman/tambah"
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
            "Volume Air (liter)",
            "volume_liter",
            data.volume_liter || "",
            "number"
          )}


          ${field(
            "Durasi (menit)",
            "durasi_menit",
            data.durasi_menit || "",
            "number"
          )}


          ${field(
            "Metode",
            "metode",
            data.metode || ""
          )}


          ${field(
            "Sumber Air",
            "sumber_air",
            data.sumber_air || ""
          )}


          ${field(
            "Kondisi Cuaca",
            "kondisi_cuaca",
            data.kondisi_cuaca || ""
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


        ${formButtons("/penyiraman")}

      </form>

    </div>

  `;


  return layout(
    title,
    content,
    "penyiraman",
    "admin"
  );
}


// ============================================================
// 44. CREATE PENYIRAMAN
// ============================================================

async function penyiramanCreate(
  request,
  env
){

  const data =
    await formToObject(request);


  try{

    await insertCompatible(
      env,
      "penyiraman",
      {

        
        pohon_id:
          data.pohon_id || null,

        blok_id:
          data.blok_id || null,

        tanggal:
          data.tanggal || dateToday(),

        volume_liter:
          num(data.volume_liter),

        durasi_menit:
          num(data.durasi_menit),

        metode:
          data.metode || null,

        sumber_air:
          data.sumber_air || null,

        kondisi_cuaca:
          data.kondisi_cuaca || null,

        operator:
          data.operator || null,

        keterangan:
          data.keterangan || null

      }
    );


    return redirect(
      request,
      "/penyiraman"
    );


  }catch(err){

    return dbErrorPage(
      "Tambah Penyiraman",
      err,
      "/penyiraman/tambah"
    );

  }
}


// ============================================================
// 45. EDIT PENYIRAMAN PAGE
// ============================================================

async function penyiramanEditPage(
  env,
  id
){

  const data =
    await env.DB
      .prepare(`
        SELECT *
        FROM penyiraman
        WHERE id=?
        LIMIT 1
      `)
      .bind(id)
      .first();


  if(!data){

    return html(
      layout(
        "Penyiraman Tidak Ditemukan",

        `
        <div class="card">

          <div class="notice notice-danger">
            Data penyiraman tidak ditemukan.
          </div>

          <a
            href="/penyiraman"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,

        "penyiraman",
        "admin"
      ),
      404
    );

  }


  return penyiramanForm(
    env,
    data,
    true
  );
}


// ============================================================
// 46. UPDATE PENYIRAMAN
// ============================================================

async function penyiramanUpdate(
  request,
  env
){

  const data =
    await formToObject(request);


  try{

    await env.DB
      .prepare(`
        UPDATE penyiraman
        SET
          pohon_id=?,
          blok_id=?,
          tanggal=?,
          volume_liter=?,
          durasi_menit=?,
          metode=?,
          sumber_air=?,
          kondisi_cuaca=?,
          operator=?,
          keterangan=?
        WHERE id=?
      `)
      .bind(

        data.pohon_id || null,

        data.blok_id || null,

        data.tanggal || dateToday(),

        num(data.volume_liter),

        num(data.durasi_menit),

        data.metode || null,

        data.sumber_air || null,

        data.kondisi_cuaca || null,

        data.operator || null,

        data.keterangan || null,

        data.id

      )
      .run();


    return redirect(
      request,
      "/penyiraman"
    );


  }catch(err){

    return dbErrorPage(
      "Edit Penyiraman",
      err,
      `/penyiraman/${encodeURIComponent(data.id)}/edit`
    );

  }
}


// ============================================================


export {
  penyiramanCreate,
  penyiramanEditPage,
  penyiramanForm,
  penyiramanList,
  penyiramanUpdate,
};
