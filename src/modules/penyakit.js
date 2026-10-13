import {
  blokOptions,
  dateToday,
  esc,
  formToObject,
  getBlok,
  getPohon,
  html,
  layout,
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

// 47. MODUL PENYAKIT
// ============================================================

async function penyakitList(env){

  const result =
    await env.DB
      .prepare(`
        SELECT
          ps.*,
          p.kode_pohon,
          p.varietas
        FROM penyakit ps
        LEFT JOIN pohon p
          ON p.id=ps.pohon_id
        ORDER BY ps.tanggal DESC
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
              ${esc(r.jenis_masalah || "-")}
            </td>

            <td>
              ${esc(r.kategori || "-")}
            </td>

            <td>
              ${esc(r.tingkat || "-")}
            </td>

            <td>
              ${esc(r.bagian_tanaman || "-")}
            </td>

            <td>
              ${esc(r.tindakan || "-")}
            </td>

            <td>
              ${esc(r.hasil || "-")}
            </td>

            <td>

              <a
                href="/penyakit/${encodeURIComponent(r.id)}/edit"
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
              Belum ada data penyakit.
            </td>
          </tr>
        `;


  const content = `

    <div class="page-title">

      <div>

        <h1>🦠 Penyakit</h1>

        <p>
          Monitoring penyakit dan masalah tanaman
        </p>

      </div>

      <a
        href="/penyakit/tambah"
        class="btn btn-primary"
      >
        ➕ Tambah Data
      </a>

    </div>


    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Tanggal</th>
              <th>Pohon</th>
              <th>Masalah</th>
              <th>Kategori</th>
              <th>Tingkat</th>
              <th>Bagian Tanaman</th>
              <th>Tindakan</th>
              <th>Hasil</th>
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
    "Penyakit",
    content,
    "penyakit",
    "admin"
  );
}


// ============================================================
// 48. FORM PENYAKIT
// ============================================================

async function penyakitForm(
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
      ? "Edit Penyakit"
      : "Tambah Penyakit";


  const content = `

    <div class="page-title">

      <div>

        <h1>🦠 ${title}</h1>

        <p>
          Pencatatan kesehatan tanaman
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/penyakit/edit"
            : "/penyakit/tambah"
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
            "Jenis Masalah",
            "jenis_masalah",
            data.jenis_masalah || "",
            "text",
            false,
            true
          )}


          ${field(
            "Kategori",
            "kategori",
            data.kategori || ""
          )}


          ${field(
            "Tingkat",
            "tingkat",
            data.tingkat || ""
          )}


          ${field(
            "Bagian Tanaman",
            "bagian_tanaman",
            data.bagian_tanaman || ""
          )}


          ${textareaField(
            "Gejala",
            "gejala",
            data.gejala || "",
            true
          )}


          ${textareaField(
            "Tindakan",
            "tindakan",
            data.tindakan || "",
            true
          )}


          ${field(
            "Bahan Pengendalian",
            "bahan_pengendalian",
            data.bahan_pengendalian || ""
          )}


          ${field(
            "Dosis",
            "dosis",
            data.dosis || ""
          )}


          ${field(
            "Hasil",
            "hasil",
            data.hasil || ""
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


        ${formButtons("/penyakit")}

      </form>

    </div>

  `;


  return layout(
    title,
    content,
    "penyakit",
    "admin"
  );
}


// ============================================================
// 49. CREATE PENYAKIT
// ============================================================

async function penyakitCreate(
  request,
  env
){

  const data =
    await formToObject(request);


  try{

    await insertCompatible(
      env,
      "penyakit",
      {

       
        pohon_id:
          data.pohon_id || null,

        blok_id:
          data.blok_id || null,

        tanggal:
          data.tanggal || dateToday(),

        jenis_masalah:
          data.jenis_masalah || null,

        kategori:
          data.kategori || null,

        tingkat:
          data.tingkat || null,

        bagian_tanaman:
          data.bagian_tanaman || null,

        gejala:
          data.gejala || null,

        tindakan:
          data.tindakan || null,

        bahan_pengendalian:
          data.bahan_pengendalian || null,

        dosis:
          data.dosis || null,

        hasil:
          data.hasil || null,

        operator:
          data.operator || null,

        keterangan:
          data.keterangan || null

      }
    );


    return redirect(
      request,
      "/penyakit"
    );


  }catch(err){

    return dbErrorPage(
      "Tambah Penyakit",
      err,
      "/penyakit/tambah"
    );

  }
}


// ============================================================
// 50. EDIT PENYAKIT PAGE
// ============================================================

async function penyakitEditPage(
  env,
  id
){

  const data =
    await env.DB
      .prepare(`
        SELECT *
        FROM penyakit
        WHERE id=?
        LIMIT 1
      `)
      .bind(id)
      .first();


  if(!data){

    return html(
      layout(
        "Penyakit Tidak Ditemukan",

        `
        <div class="card">

          <div class="notice notice-danger">
            Data penyakit tidak ditemukan.
          </div>

          <a
            href="/penyakit"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,

        "penyakit",
        "admin"
      ),
      404
    );

  }


  return penyakitForm(
    env,
    data,
    true
  );
}


// ============================================================
// 51. UPDATE PENYAKIT
// ============================================================

async function penyakitUpdate(
  request,
  env
){

  const data =
    await formToObject(request);


  try{

    await env.DB
      .prepare(`
        UPDATE penyakit
        SET
          pohon_id=?,
          blok_id=?,
          tanggal=?,
          jenis_masalah=?,
          kategori=?,
          tingkat=?,
          bagian_tanaman=?,
          gejala=?,
          tindakan=?,
          bahan_pengendalian=?,
          dosis=?,
          hasil=?,
          operator=?,
          keterangan=?
        WHERE id=?
      `)
      .bind(

        data.pohon_id || null,

        data.blok_id || null,

        data.tanggal || dateToday(),

        data.jenis_masalah || null,

        data.kategori || null,

        data.tingkat || null,

        data.bagian_tanaman || null,

        data.gejala || null,

        data.tindakan || null,

        data.bahan_pengendalian || null,

        data.dosis || null,

        data.hasil || null,

        data.operator || null,

        data.keterangan || null,

        data.id

      )
      .run();


    return redirect(
      request,
      "/penyakit"
    );


  }catch(err){

    return dbErrorPage(
      "Edit Penyakit",
      err,
      `/penyakit/${encodeURIComponent(data.id)}/edit`
    );

  }
}

// ============================================================


export {
  penyakitCreate,
  penyakitEditPage,
  penyakitForm,
  penyakitList,
  penyakitUpdate,
};
