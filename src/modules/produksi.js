import {
  dateToday,
  esc,
  formToObject,
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

// 32. MODUL PRODUKSI
// ============================================================

async function produksiList(env){

  const result =
    await env.DB
      .prepare(`
        SELECT
          pr.*,
          p.kode_pohon,
          p.varietas
        FROM produksi pr
        LEFT JOIN pohon p
          ON p.id = pr.pohon_id
        ORDER BY pr.tanggal DESC
      `)
      .all();

  const rows =
    result.results || [];

  let tableRows = "";

  if(!rows.length){

    tableRows = `
      <tr>
        <td colspan="9" class="empty">
          Belum ada data produksi.
        </td>
      </tr>
    `;

  }else{

    tableRows = rows.map(r => `

      <tr>

        <td>
          ${esc(r.tanggal || "-")}
        </td>

        <td>
          ${esc(r.kode_pohon || "-")}
        </td>

        <td>
          ${esc(r.komoditas || "-")}
        </td>

        <td>
          ${esc(r.produk || "-")}
        </td>

        <td>
          ${r.berat_kg !== null &&
            r.berat_kg !== undefined &&
            r.berat_kg !== ""
            ? esc(r.berat_kg)
            : "-"
          }
        </td>

        <td>
          ${
            r.harga_per_kg !== null &&
            r.harga_per_kg !== undefined &&
            r.harga_per_kg !== ""
              ? `Rp ${Number(r.harga_per_kg).toLocaleString("id-ID")}`
              : "-"
          }
        </td>

        <td>
          ${
            r.nilai_total !== null &&
            r.nilai_total !== undefined &&
            r.nilai_total !== ""
              ? `Rp ${Number(r.nilai_total).toLocaleString("id-ID")}`
              : "-"
          }
        </td>

        <td>
          ${esc(r.kualitas || "-")}
        </td>

        <td>

          <div class="actions">

            <a
              href="/produksi/${encodeURIComponent(r.id)}/edit"
              class="btn btn-secondary btn-sm"
            >
              ✏️ Edit
            </a>

          </div>

        </td>

      </tr>

    `).join("");

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>📦 Produksi</h1>

        <p>
          Catatan produksi dan hasil kebun
        </p>

      </div>

      <a
        href="/produksi/tambah"
        class="btn btn-primary"
      >
        ➕ Tambah Produksi
      </a>

    </div>


    <div class="card">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Tanggal</th>
              <th>Pohon</th>
              <th>Komoditas</th>
              <th>Produk</th>
              <th>Berat (kg)</th>
              <th>Harga/kg</th>
              <th>Nilai</th>
              <th>Kualitas</th>
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
    "Produksi",
    content,
    "produksi",
    "admin"
  );
}


// ============================================================
// 33. FORM PRODUKSI
// ============================================================

async function produksiForm(
  env,
  data = {},
  edit = false
){

  const pohon =
    await getPohon(env);

  const title =
    edit
      ? "Edit Produksi"
      : "Tambah Produksi";


  const content = `

    <div class="page-title">

      <div>

        <h1>📦 ${title}</h1>

        <p>
          Pencatatan produksi kebun
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/produksi/edit"
            : "/produksi/tambah"
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
            data.pohon_id || "",
            false,
            false
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
            "Komoditas",
            "komoditas",
            data.komoditas || ""
          )}


          ${field(
            "Produk",
            "produk",
            data.produk || "",
            "text",
            false,
            true
          )}


          ${field(
            "Berat (kg)",
            "berat_kg",
            data.berat_kg || "",
            "number"
          )}


          ${field(
            "Jumlah Buah",
            "jumlah_buah",
            data.jumlah_buah || "",
            "number"
          )}


          ${field(
            "Kualitas",
            "kualitas",
            data.kualitas || ""
          )}


          ${field(
            "Kadar Air (%)",
            "kadar_air_persen",
            data.kadar_air_persen || "",
            "number"
          )}


          ${field(
            "Fermentasi",
            "fermentasi",
            data.fermentasi || ""
          )}


          ${field(
            "Harga per kg",
            "harga_per_kg",
            data.harga_per_kg || "",
            "number"
          )}


          ${field(
            "Nilai Total",
            "nilai_total",
            data.nilai_total || "",
            "number"
          )}


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            true
          )}

        </div>


        ${formButtons("/produksi")}

      </form>

    </div>

  `;


  return layout(
    title,
    content,
    "produksi",
    "admin"
  );
}


// ============================================================
// 34. CREATE PRODUKSI
// ============================================================

async function produksiCreate(
  request,
  env
){

  const data =
    await formToObject(request);


  if(!data.pohon_id){

    return html(
      "Pohon wajib dipilih."
    );

  }


  try{

    let nilaiTotal =
      num(data.nilai_total);


    if(
      nilaiTotal === null &&
      num(data.berat_kg) !== null &&
      num(data.harga_per_kg) !== null
    ){

      nilaiTotal =
        num(data.berat_kg) *
        num(data.harga_per_kg);

    }


    await insertCompatible(
      env,
      "produksi",
      {

        // id sengaja tidak dikirim.
        // SQLite akan membuat AUTOINCREMENT.

        pohon_id:
          Number(data.pohon_id),

        tanggal:
          data.tanggal || dateToday(),

        komoditas:
          data.komoditas || null,

        produk:
          data.produk || null,

        berat_kg:
          num(data.berat_kg),

        jumlah_buah:
          data.jumlah_buah !== ""
            ? Number(data.jumlah_buah)
            : null,

        kualitas:
          data.kualitas || null,

        kadar_air_persen:
          num(data.kadar_air_persen),

        fermentasi:
          data.fermentasi || null,

        harga_per_kg:
          num(data.harga_per_kg),

        nilai_total:
          nilaiTotal,

        keterangan:
          data.keterangan || null

      }
    );


    return redirect(
      request,
      "/produksi"
    );


  }catch(err){

    return dbErrorPage(
      "Tambah Produksi",
      err,
      "/produksi/tambah"
    );

  }
}


// ============================================================
// 35. EDIT PRODUKSI PAGE
// ============================================================

async function produksiEditPage(
  env,
  id
){

  const data =
    await env.DB
      .prepare(`
        SELECT *
        FROM produksi
        WHERE id=?
        LIMIT 1
      `)
      .bind(id)
      .first();


  if(!data){

    return html(
      layout(
        "Produksi Tidak Ditemukan",

        `
        <div class="card">

          <div class="notice notice-danger">
            Data produksi tidak ditemukan.
          </div>

          <a
            href="/produksi"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,

        "produksi",
        "admin"
      ),
      404
    );

  }


  return produksiForm(
    env,
    data,
    true
  );
}


// ============================================================
// 36. UPDATE PRODUKSI
// ============================================================

async function produksiUpdate(
  request,
  env
){

  const data =
    await formToObject(request);


  if(!data.id){

    return html(
      layout(
        "Edit Produksi",
        `
        <div class="card">

          <div class="notice notice-danger">
            ID produksi tidak ditemukan.
          </div>

          <a
            href="/produksi"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,
        "produksi",
        "admin"
      ),
      400
    );

  }


  if(!data.pohon_id){

    return html(
      layout(
        "Edit Produksi",
        `
        <div class="card">

          <div class="notice notice-danger">
            Pohon wajib dipilih.
          </div>

          <a
            href="/produksi/${encodeURIComponent(data.id)}/edit"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>
        `,
        "produksi",
        "admin"
      ),
      400
    );

  }


  try{

    const pohonId =
      Number(data.pohon_id);


    const jumlahBuah =
      data.jumlah_buah !== ""
        ? Number(data.jumlah_buah)
        : null;


    let nilaiTotal =
      num(data.nilai_total);


    if(
      nilaiTotal === null &&
      num(data.berat_kg) !== null &&
      num(data.harga_per_kg) !== null
    ){

      nilaiTotal =
        num(data.berat_kg) *
        num(data.harga_per_kg);

    }


    await env.DB
      .prepare(`
        UPDATE produksi
        SET
          pohon_id=?,
          tanggal=?,
          komoditas=?,
          produk=?,
          berat_kg=?,
          jumlah_buah=?,
          kualitas=?,
          kadar_air_persen=?,
          fermentasi=?,
          harga_per_kg=?,
          nilai_total=?,
          keterangan=?
        WHERE id=?
      `)
      .bind(

        pohonId,

        data.tanggal || dateToday(),

        data.komoditas || null,

        data.produk || null,

        num(data.berat_kg),

        jumlahBuah,

        data.kualitas || null,

        num(data.kadar_air_persen),

        data.fermentasi || null,

        num(data.harga_per_kg),

        nilaiTotal,

        data.keterangan || null,

        data.id

      )
      .run();


    return redirect(
      request,
      "/produksi"
    );


  }catch(err){

    return dbErrorPage(
      "Edit Produksi",
      err,
      `/produksi/${encodeURIComponent(data.id)}/edit`
    );

  }

}


// ============================================================


export {
  produksiCreate,
  produksiEditPage,
  produksiForm,
  produksiList,
  produksiUpdate,
};
