import {
  esc,
  layout,
  redirect,
} from "./core.js";

import {
  field,
  formButtons,
  selectField,
  textareaField,
} from "./helpers-db.js";

async function pohonSampelList(env){

  const data =
    await env.DB
      .prepare(`
        SELECT
          ps.id,
          ps.kode_sampel,
          ps.status,
          ps.keterangan,

          p.kode_pohon,
          p.komoditas,
          p.varietas,

          pl.kode_plot,
          pl.nama_plot,

          b.kode_blok,
          b.nama_blok

        FROM pohon_sampel ps

        LEFT JOIN pohon p
          ON p.id = ps.pohon_id

        LEFT JOIN plot pl
          ON pl.id = ps.plot_id

        LEFT JOIN blok b
          ON b.id = pl.blok_id

        ORDER BY ps.id DESC
      `)
      .all();


  const rows =
    data.results || [];


  return layout(

    "Pohon Sampel",

    `
      <div class="page-header">

        <div>
          <h1>Pohon Sampel</h1>

          <p>
            Daftar pohon yang digunakan
            sebagai sampel penelitian.
          </p>
        </div>
        <div class="actions">

  <a
    href="/pohon-sampel/new"
    class="btn btn-primary"
  >
    ➕ Tambah Pohon Sampel
  </a>

</div>
      </div>


      <div class="card">

        <div class="table-wrap">

          <table>

            <thead>

              <tr>

                <th>Kode Sampel</th>

                <th>Kode Pohon</th>

                <th>Plot</th>

                <th>Blok</th>

                <th>Komoditas</th>

                <th>Varietas</th>

                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              ${
                rows.length

                  ? rows.map(x => `

                    <tr>

                      <td>
                        ${
    x.kode_sampel
      ? `
        <a
          href="/pohon-sampel/${encodeURIComponent(x.id)}"
          class="btn btn-secondary btn-sm"
        >
          ${esc(x.kode_sampel)}
        </a>
      `
      : "-"
  }
                      </td>

                      <td>
                        ${x.kode_pohon || "-"}
                      </td>

                      <td>
                        ${x.kode_plot || "-"}
                      </td>

                      <td>
                        ${x.kode_blok || "-"}
                      </td>

                      <td>
                        ${x.komoditas || "-"}
                      </td>

                      <td>
                        ${x.varietas || "-"}
                      </td>

                      <td>
                        ${x.status || "-"}
                      </td>

                    </tr>

                  `).join("")

                  : `

                    <tr>

                      <td
                        colspan="7"
                        style="text-align:center;"
                      >
                        Belum ada pohon sampel.
                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>

      </div>
    `

  );

}

// ========================================================
// POHON SAMPEL — DETAIL
// ========================================================

async function pohonSampelDetail(
  env,
  id
){

  const data =
    await env.DB
      .prepare(`
        SELECT
          ps.*,

          p.kode_pohon,
          p.komoditas,
          p.varietas,
          p.tahun_tanam,
          p.tanggal_tanam,
          p.tinggi_m,
          p.diameter_batang_cm,
          p.diameter_kanopi_m,
          p.kondisi AS kondisi_pohon,

          pl.kode_plot,
          pl.nama_plot,
          pl.fungsi AS fungsi_plot,

          b.kode_blok,
          b.nama_blok,
          b.lokasi,
          b.ketinggian_mdpl,
          b.kemiringan_persen

        FROM pohon_sampel ps

        JOIN pohon p
          ON p.id = ps.pohon_id

        JOIN plot pl
          ON pl.id = ps.plot_id

        LEFT JOIN blok b
          ON b.id = pl.blok_id

        WHERE ps.id = ?

        LIMIT 1
      `)
      .bind(id)
      .first();


  if(!data){

    return layout(
      "Pohon Sampel Tidak Ditemukan",

      `
        <div class="card">

          <h2>
            Pohon sampel tidak ditemukan.
          </h2>

          <p>
            Data pohon sampel tidak tersedia.
          </p>

          <a
            href="/pohon-sampel"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,

      "pohon-sampel",
      "admin"
    );

  }


  const pengamatan =
    await env.DB
      .prepare(`
        SELECT *
        FROM pengamatan
        WHERE pohon_sampel_id = ?
        ORDER BY tanggal_pengamatan DESC
      `)
      .bind(data.id)
      .all();


  const panen =
    await env.DB
      .prepare(`
        SELECT *
        FROM panen_riset
        WHERE pohon_sampel_id = ?
        ORDER BY tanggal_panen DESC
      `)
      .bind(data.id)
      .all();

       const foto =
  await env.DB
    .prepare(`
      SELECT *
      FROM foto_pohon_sampel
      WHERE CAST(pohon_sampel_id AS TEXT) = CAST(? AS TEXT)
      ORDER BY tanggal_foto DESC, created_at DESC
    `)
    .bind(String(data.id))
    .all();

 

  const pengamatanRows =
    pengamatan.results || [];

  const panenRows =
    panen.results || [];

  const fotoRows =
  foto.results || [];

  const content = `

  <div class="page-title">

      <div>

        <h1>
          🌱 ${esc(data.kode_sampel)}
        </h1>

        <p>
          Detail pohon sampel penelitian
        </p>

      </div>

      <div class="actions">

        <a
          href="/pohon-sampel"
          class="btn btn-secondary"
        >
          ← Kembali
        </a>

      </div>

    </div>


    <div class="card">

      <h2>
        Identitas Pohon
      </h2>

      <div class="form-grid">

        ${field(
          "Kode Sampel",
          "kode_sampel",
          data.kode_sampel || "",
          "text",
          true
        )}

        ${field(
          "Kode Pohon",
          "kode_pohon",
          data.kode_pohon || "",
          "text",
          true
        )}

        ${field(
          "Komoditas",
          "komoditas",
          data.komoditas || "",
          "text",
          true
        )}

        ${field(
          "Varietas",
          "varietas",
          data.varietas || "",
          "text",
          true
        )}

        ${field(
          "Plot",
          "kode_plot",
          data.kode_plot || "",
          "text",
          true
        )}

        ${field(
          "Nama Plot",
          "nama_plot",
          data.nama_plot || "",
          "text",
          true
        )}

        ${field(
          "Blok",
          "kode_blok",
          data.kode_blok || "",
          "text",
          true
        )}

        ${field(
          "Nama Blok",
          "nama_blok",
          data.nama_blok || "",
          "text",
          true
        )}

        ${field(
          "Ketinggian",
          "ketinggian_mdpl",
          data.ketinggian_mdpl
            ? `${data.ketinggian_mdpl} mdpl`
            : "",
          "text",
          true
        )}

        ${field(
          "Kemiringan",
          "kemiringan_persen",
          data.kemiringan_persen !== null &&
          data.kemiringan_persen !== undefined
            ? `${data.kemiringan_persen}%`
            : "",
          "text",
          true
        )}

      </div>

    </div>


    <div class="card">

      <h2>
        Kondisi Pohon
      </h2>

      <div class="form-grid">

        ${field(
          "Tahun Tanam",
          "tahun_tanam",
          data.tahun_tanam || "",
          "text",
          true
        )}

        ${field(
          "Tanggal Tanam",
          "tanggal_tanam",
          data.tanggal_tanam || "",
          "text",
          true
        )}

        ${field(
          "Tinggi",
          "tinggi_m",
          data.tinggi_m !== null &&
          data.tinggi_m !== undefined
            ? `${data.tinggi_m} m`
            : "",
          "text",
          true
        )}

        ${field(
          "Diameter Batang",
          "diameter_batang_cm",
          data.diameter_batang_cm !== null &&
          data.diameter_batang_cm !== undefined
            ? `${data.diameter_batang_cm} cm`
            : "",
          "text",
          true
        )}

        ${field(
          "Diameter Kanopi",
          "diameter_kanopi_m",
          data.diameter_kanopi_m !== null &&
          data.diameter_kanopi_m !== undefined
            ? `${data.diameter_kanopi_m} m`
            : "",
          "text",
          true
        )}

        ${field(
          "Kondisi",
          "kondisi_pohon",
          data.kondisi_pohon || "",
          "text",
          true
        )}

      </div>

    </div>


    <div class="card">

  <div class="page-title">

    <div>
      <h2>
        Riwayat Pengamatan
      </h2>
    </div>

    <div class="actions">

      <a
        href="/pohon-sampel/${encodeURIComponent(data.id)}/pengamatan/new"
        class="btn btn-primary"
      >
        ➕ Tambah Pengamatan
      </a>

    </div>

  </div>

      ${
        pengamatanRows.length

          ? `

            <div class="table-wrap">

              <table>

                <thead>

  <tr>

    <th>Tanggal</th>
    <th>Tinggi</th>
    <th>Batang</th>
    <th>Kanopi</th>
    <th>Bunga</th>
    <th>Buah</th>
    <th>Jumlah</th>
    <th>Kondisi</th>
    <th>Cuaca</th>
    <th>Aksi</th>

  </tr>

</thead>

                <tbody>

                  ${
                    pengamatanRows.map(x => `

                      <tr>

                        <td>
                          ${esc(x.tanggal_pengamatan)}
                        </td>

                        <td>
                          ${
                            x.tinggi_m !== null
                              ? `${esc(x.tinggi_m)} m`
                              : "-"
                          }
                        </td>

                        <td>
                          ${
                            x.diameter_batang_cm !== null
                              ? `${esc(x.diameter_batang_cm)} cm`
                              : "-"
                          }
                        </td>

                        <td>
                          ${
                            x.diameter_kanopi_m !== null
                              ? `${esc(x.diameter_kanopi_m)} m`
                              : "-"
                          }
                        </td>

                        <td>
                          ${esc(x.kondisi_bunga || "-")}
                        </td>

                        <td>
                          ${esc(x.kondisi_buah || "-")}
                        </td>

                        <td>
                          ${esc(x.jumlah_buah ?? "-")}
                        </td>

                        <td>
                          ${esc(x.kondisi_tanaman || "-")}
                        </td>

                        <td>
                          ${esc(x.kondisi_cuaca || "-")}
                        </td>

                        <td>

  <a
    href="/pohon-sampel/${encodeURIComponent(data.id)}/pengamatan/${encodeURIComponent(x.id)}/edit"
    class="btn btn-secondary"
  >
    ✏️ Edit
  </a>

</td>
                      </tr>

                    `).join("")
                  }

                </tbody>

              </table>

            </div>

          `

          : `

            <p class="empty">
              Belum ada data pengamatan.
            </p>

          `
      }

    </div>


    <div class="card">

  <div class="page-title">

    <div>
      <h2>
        Riwayat Panen Riset
      </h2>
    </div>

    <div class="actions">

      <a
        href="/pohon-sampel/${encodeURIComponent(data.id)}/panen-riset/new"
        class="btn btn-primary"
      >
        ➕ Tambah Panen Riset
      </a>

    </div>

  </div>

      ${
        panenRows.length

          ? `

            <div class="table-wrap">

              <table>

                <thead>

                  <tr>

                    <th>Tanggal</th>
                    <th>Jumlah Buah</th>
                    <th>Berat Total</th>
                    <th>Kematangan</th>
                    <th>Kondisi</th>
                    <th>Catatan</th>
                    <th>Aksi</th>

                  </tr>

                </thead>

                <tbody>

                  ${
                    panenRows.map(x => `

                      <tr>

                        <td>
                          ${esc(x.tanggal_panen)}
                        </td>

                        <td>
                          ${esc(x.jumlah_buah ?? "-")}
                        </td>

                        <td>
                          ${
                            x.berat_total_kg !== null
                              ? `${esc(x.berat_total_kg)} kg`
                              : "-"
                          }
                        </td>

                        <td>
                          ${esc(x.tingkat_kematangan || "-")}
                        </td>

                        <td>
                          ${esc(x.kondisi_buah || "-")}
                        </td>

                        <td>
                          ${esc(x.catatan || "-")}
                        </td>
                         
                        <td>

  <a
    href="/pohon-sampel/${encodeURIComponent(data.id)}/panen-riset/${encodeURIComponent(x.id)}/edit"
    class="btn btn-secondary"
  >
    ✏️ Edit
  </a>

  <form
    method="POST"
    action="/pohon-sampel/${encodeURIComponent(data.id)}/panen-riset/${encodeURIComponent(x.id)}/delete"
    style="display:inline;"
    onsubmit="return confirm('Hapus data panen riset ini? Data yang sudah dihapus tidak dapat dikembalikan.');"
  >

    <button
      type="submit"
      class="btn btn-danger"
    >
      🗑️ Hapus
    </button>

  </form>

</td>
                      </tr>

                    `).join("")
                  }

                </tbody>

              </table>

            </div>

          `

          : `

            <p class="empty">
              Belum ada data panen riset.
            </p>

          `
           }

    </div>


    <div class="card">

  <div class="page-title">

    <div>
      <h2>
        📷 Foto Pohon Sampel
      </h2>
    </div>

    <div class="actions">

      <a
        href="/pohon-sampel/${encodeURIComponent(data.id)}/foto/new"
        class="btn btn-primary"
      >
        📷 Tambah Foto
      </a>

    </div>

  </div>

 ${
  fotoRows.length

    ? `

      <div class="table-wrap">

        <table>

          <thead>

            <tr>

              <th>Foto</th>
              <th>Tanggal</th>
              <th>Jenis</th>
              <th>Keterangan</th>
              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

            ${
              fotoRows.map(x => `

                <tr>

                  <td>

                    <img
                      src="${esc(x.url_foto)}"
                      alt="${esc(x.jenis_foto || "Foto")}"
                      style="
                        width:120px;
                        height:90px;
                        object-fit:cover;
                        border-radius:8px;
                        display:block;
                      "
                    >

                  </td>

                  <td>
                    ${esc(x.tanggal_foto)}
                  </td>

                  <td>
                    ${esc(x.jenis_foto)}
                  </td>

                  <td>
  ${esc(x.keterangan || "-")}
</td>

<td>

  <a
    href="/pohon-sampel/${encodeURIComponent(data.id)}/foto/${encodeURIComponent(x.id)}/edit"
    class="btn btn-secondary btn-sm"
  >
    ✏️ Edit
  </a>

  <form
    method="POST"
    action="/pohon-sampel/${encodeURIComponent(data.id)}/foto/${encodeURIComponent(x.id)}/delete"
    style="display:inline;"
    onsubmit="return confirm('Hapus foto ini?');"
  >

    <button
      type="submit"
      class="btn btn-danger btn-sm"
    >
      🗑️ Hapus
    </button>

  </form>

</td>

</tr>
                

              `).join("")
            }

          </tbody>

        </table>

      </div>

    `

    : `

      <p class="empty">
        Belum ada foto pohon sampel.
      </p>

    `
}

</div>


      ${
        fotoRows.length

          ? `

            <div
              style="
                display:grid;
                grid-template-columns:
                  repeat(auto-fill,minmax(220px,1fr));
                gap:20px;
              "
            >

              ${
                fotoRows.map(x => `

                  <div
                    style="
                      border:1px solid rgba(0,0,0,.1);
                      border-radius:12px;
                      padding:12px;
                    "
                  >

                    <img
                      src="${esc(x.url_foto)}"
                      alt="${esc(x.jenis_foto || "Foto pohon sampel")}"
                      style="
                        width:100%;
                        height:220px;
                        object-fit:cover;
                        border-radius:10px;
                        display:block;
                      "
                    >

                    <div style="margin-top:10px;">

                      <strong>
                        ${esc(x.jenis_foto)}
                      </strong>

                      <div style="margin-top:5px;">
                        ${esc(x.tanggal_foto)}
                      </div>

                      ${
                        x.keterangan
                          ? `
                            <div style="margin-top:5px;">
                              ${esc(x.keterangan)}
                            </div>
                          `
                          : ""
                      }

                    </div>

                  </div>

                `).join("")
              }

            </div>

          `

          : `

            <p class="empty">
              Belum ada foto pohon sampel.
            </p>

          `
      }

    </div>

  `;

  

  return layout(
    `Pohon Sampel ${data.kode_sampel}`,
    content,
    "pohon-sampel",
    "admin"
  );

}


// ========================================================
// POHON SAMPEL — FORM
// ========================================================

async function pohonSampelForm(
  env,
  data = {}
){

  const [
    pohon,
    plot
  ] = await Promise.all([

    env.DB
      .prepare(`
        SELECT
          p.id,
          p.kode_pohon,
          p.komoditas,
          p.varietas,
          p.blok_id,
          b.kode_blok
        FROM pohon p
        LEFT JOIN blok b
          ON b.id = p.blok_id
        WHERE p.status = 'aktif'
          AND p.id NOT IN (
            SELECT pohon_id
            FROM pohon_sampel
          )
        ORDER BY p.kode_pohon
      `)
      .all(),

    env.DB
      .prepare(`
        SELECT
          pl.id,
          pl.kode_plot,
          pl.nama_plot,
          pl.komoditas,
          pl.varietas,
          b.kode_blok
        FROM plot pl
        LEFT JOIN blok b
          ON b.id = pl.blok_id
        WHERE pl.status = 'aktif'
        ORDER BY pl.kode_plot
      `)
      .all()

  ]);


  const pohonRows =
    pohon.results || [];

  const plotRows =
    plot.results || [];


  const pohonOptions =
    pohonRows.map(p => `

      <option
        value="${p.id}"
        ${
          String(data.pohon_id || "") ===
          String(p.id)
            ? "selected"
            : ""
        }
      >
        ${esc(p.kode_pohon)}
        — ${esc(p.komoditas || "-")}
        — ${esc(p.varietas || "-")}
        — Blok ${esc(p.kode_blok || "-")}
      </option>

    `).join("");


  const plotOptions =
    plotRows.map(p => `

      <option
        value="${p.id}"
        ${
          String(data.plot_id || "") ===
          String(p.id)
            ? "selected"
            : ""
        }
      >
        ${esc(p.kode_plot)}
        — ${esc(p.komoditas || "-")}
        — ${esc(p.varietas || "-")}
        — Blok ${esc(p.kode_blok || "-")}
      </option>

    `).join("");


  const content = `

    <div class="page-title">

      <div>

        <h1>
          🌱 Tambah Pohon Sampel
        </h1>

        <p>
          Menetapkan pohon sebagai sampel penelitian.
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="/pohon-sampel/new"
      >

        <div class="form-grid">


          ${selectField(
            "Pohon",
            "pohon_id",
            `
              <option value="">
                -- pilih pohon --
              </option>

              ${pohonOptions}
            `,
            data.pohon_id || "",
            false,
            true
          )}


          ${selectField(
            "Plot",
            "plot_id",
            `
              <option value="">
                -- pilih plot --
              </option>

              ${plotOptions}
            `,
            data.plot_id || "",
            false,
            true
          )}


          ${field(
            "Kode Sampel",
            "kode_sampel",
            data.kode_sampel || "",
            "text",
            false,
            true
          )}


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            true
          )}

        </div>


        ${formButtons("/pohon-sampel")}

      </form>

    </div>

  `;


  return layout(
    "Tambah Pohon Sampel",
    content,
    "pohon-sampel",
    "admin"
  );
}

async function panenRisetForm(
  env,
  pohonSampelId,
  data = {}
){

  const sampel =
    await env.DB
      .prepare(`
        SELECT
          ps.id,
          ps.kode_sampel,
          p.kode_pohon,
          p.komoditas,
          p.varietas,
          pl.kode_plot,
          b.kode_blok
        FROM pohon_sampel ps
        JOIN pohon p
          ON p.id = ps.pohon_id
        JOIN plot pl
          ON pl.id = ps.plot_id
        LEFT JOIN blok b
          ON b.id = pl.blok_id
        WHERE ps.id = ?
          AND ps.status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return new Response(
      "Pohon sampel tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>
          🍈 Tambah Panen Riset
        </h1>

        <p>
          Mencatat hasil panen pohon sampel.
        </p>

      </div>

    </div>


    <div class="card">

      <div
        style="
          margin-bottom:20px;
          padding:15px;
          border-radius:8px;
          background:rgba(0,0,0,.04);
        "
      >

        <strong>
          ${esc(sampel.kode_sampel)}
        </strong>

        — Pohon
        <strong>
          ${esc(sampel.kode_pohon)}
        </strong>

        — Plot
        <strong>
          ${esc(sampel.kode_plot)}
        </strong>

        — Blok
        <strong>
          ${esc(sampel.kode_blok || "-")}
        </strong>

      </div>


      <form
        method="POST"
        action="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/panen-riset/new"
      >

        <div class="form-grid">

          ${field(
            "Tanggal Panen",
            "tanggal_panen",
            data.tanggal_panen || "",
            "date",
            false,
            true
          )}

         ${field(
           "Jumlah Buah",
           "jumlah_buah",
          data.jumlah_buah || "",
          "number"
         )}

          ${field(
            "Berat Total (kg)",
            "berat_total_kg",
            data.berat_total_kg || "",
            "number"
          )}

          ${field(
            "Tingkat Kematangan",
            "tingkat_kematangan",
            data.tingkat_kematangan || ""
          )}

          ${field(
            "Kondisi Buah",
            "kondisi_buah",
            data.kondisi_buah || ""
          )}

          ${textareaField(
            "Catatan",
            "catatan",
            data.catatan || "",
            true
          )}

        </div>

        ${formButtons(
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
        )}

      </form>

    </div>

  `;


  return layout(
    "Tambah Panen Riset",
    content,
    "pohon-sampel",
    "admin"
  );

}

async function panenRisetCreate(
  request,
  env,
  pohonSampelId
){

  const form =
    await request.formData();


  const tanggal_panen =
    form.get("tanggal_panen")?.trim();

  const jumlah_buah =
    form.get("jumlah_buah")?.trim();

  const berat_total_kg =
    form.get("berat_total_kg")?.trim();

  const tingkat_kematangan =
    form.get("tingkat_kematangan")?.trim();

  const kondisi_buah =
    form.get("kondisi_buah")?.trim();

  const catatan =
    form.get("catatan")?.trim();


  const sampel =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE id = ?
          AND status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return new Response(
      "Pohon sampel tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  if(!tanggal_panen){

    return new Response(
      "Tanggal panen wajib diisi.",
      {
        status: 400,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  await env.DB
    .prepare(`
      INSERT INTO panen_riset (
        pohon_sampel_id,
        tanggal_panen,
        jumlah_buah,
        berat_total_kg,
        tingkat_kematangan,
        kondisi_buah,
        catatan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      pohonSampelId,
      tanggal_panen,
      jumlah_buah
        ? Number(jumlah_buah)
        : null,
      berat_total_kg
        ? Number(berat_total_kg)
        : null,
      tingkat_kematangan || null,
      kondisi_buah || null,
      catatan || null
    )
    .run();


  return new Response(
    null,
    {
      status: 303,
      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );

}

async function panenRisetEditForm(
  env,
  pohonSampelId,
  panenId
){

  const data =
    await env.DB
      .prepare(`
        SELECT
          pr.*,

          ps.kode_sampel,

          p.kode_pohon,
          p.komoditas,
          p.varietas,

          pl.kode_plot,

          b.kode_blok

        FROM panen_riset pr

        JOIN pohon_sampel ps
          ON ps.id = pr.pohon_sampel_id

        JOIN pohon p
          ON p.id = ps.pohon_id

        JOIN plot pl
          ON pl.id = ps.plot_id

        LEFT JOIN blok b
          ON b.id = pl.blok_id

        WHERE pr.id = ?
          AND pr.pohon_sampel_id = ?
          AND ps.status = 'aktif'

        LIMIT 1
      `)
      .bind(
        panenId,
        pohonSampelId
      )
      .first();


  if(!data){

    return new Response(
      "Data panen riset tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>
          ✏️ Edit Panen Riset
        </h1>

        <p>
          Mengubah hasil panen pohon sampel.
        </p>

      </div>

    </div>


    <div class="card">

      <div
        style="
          margin-bottom:20px;
          padding:15px;
          border-radius:8px;
          background:rgba(0,0,0,.04);
        "
      >

        <strong>
          ${esc(data.kode_sampel)}
        </strong>

        — Pohon
        <strong>
          ${esc(data.kode_pohon)}
        </strong>

        — Plot
        <strong>
          ${esc(data.kode_plot)}
        </strong>

        — Blok
        <strong>
          ${esc(data.kode_blok || "-")}
        </strong>

      </div>


      <form
        method="POST"
        action="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/panen-riset/${encodeURIComponent(panenId)}/update"
      >

        <div class="form-grid">

          ${field(
            "Tanggal Panen",
            "tanggal_panen",
            data.tanggal_panen || "",
            "date",
            false,
            true
          )}

          ${field(
            "Jumlah Buah",
            "jumlah_buah",
            data.jumlah_buah ?? "",
            "number"
          )}

          ${field(
            "Berat Total (kg)",
            "berat_total_kg",
            data.berat_total_kg ?? "",
            "number"
          )}

          ${field(
            "Tingkat Kematangan",
            "tingkat_kematangan",
            data.tingkat_kematangan || ""
          )}

          ${field(
            "Kondisi Buah",
            "kondisi_buah",
            data.kondisi_buah || ""
          )}

          ${textareaField(
            "Catatan",
            "catatan",
            data.catatan || "",
            true
          )}

        </div>

        ${formButtons(
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
        )}

      </form>

    </div>

  `;


  return layout(
    "Edit Panen Riset",
    content,
    "pohon-sampel",
    "admin"
  );

}

async function panenRisetUpdate(
  request,
  env,
  pohonSampelId,
  panenId
){

  const form =
    await request.formData();


  const tanggal_panen =
    form.get("tanggal_panen")?.trim();

  const jumlah_buah =
    form.get("jumlah_buah")?.trim();

  const berat_total_kg =
    form.get("berat_total_kg")?.trim();

  const tingkat_kematangan =
    form.get("tingkat_kematangan")?.trim();

  const kondisi_buah =
    form.get("kondisi_buah")?.trim();

  const catatan =
    form.get("catatan")?.trim();


  // ======================================================
  // VALIDASI POHON SAMPEL
  // ======================================================

  const sampel =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE id = ?
          AND status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return new Response(
      "Pohon sampel tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ======================================================
  // VALIDASI DATA PANEN RISET
  // ======================================================

  const panen =
    await env.DB
      .prepare(`
        SELECT id
        FROM panen_riset
        WHERE id = ?
          AND pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        panenId,
        pohonSampelId
      )
      .first();


  if(!panen){

    return new Response(
      "Data panen riset tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ======================================================
  // VALIDASI TANGGAL
  // ======================================================

  if(!tanggal_panen){

    return new Response(
      "Tanggal panen wajib diisi.",
      {
        status: 400,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ======================================================
  // UPDATE
  // ======================================================

  await env.DB
    .prepare(`
      UPDATE panen_riset

      SET
        tanggal_panen = ?,
        jumlah_buah = ?,
        berat_total_kg = ?,
        tingkat_kematangan = ?,
        kondisi_buah = ?,
        catatan = ?

      WHERE id = ?
        AND pohon_sampel_id = ?
    `)
    .bind(

      tanggal_panen,

      jumlah_buah
        ? Number(jumlah_buah)
        : null,

      berat_total_kg
        ? Number(berat_total_kg)
        : null,

      tingkat_kematangan || null,

      kondisi_buah || null,

      catatan || null,

      panenId,

      pohonSampelId

    )
    .run();


  // ======================================================
  // KEMBALI KE DETAIL POHON SAMPEL
  // ======================================================

  return new Response(
    null,
    {
      status: 303,

      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );

}

async function panenRisetDelete(
  env,
  pohonSampelId,
  panenId
){

  const panen =
    await env.DB
      .prepare(`
        SELECT id
        FROM panen_riset
        WHERE id = ?
          AND pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        panenId,
        pohonSampelId
      )
      .first();


  if(!panen){

    return new Response(
      "Data panen riset tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  await env.DB
    .prepare(`
      DELETE FROM panen_riset
      WHERE id = ?
        AND pohon_sampel_id = ?
    `)
    .bind(
      panenId,
      pohonSampelId
    )
    .run();


  return new Response(
    null,
    {
      status: 303,

      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );

}


// ========================================================
// POHON SAMPEL — CREATE
// ========================================================

async function pohonSampelCreate(
  request,
  env
){

  const form =
    await request.formData();


  const pohon_id =
    Number(
      form.get("pohon_id")
    );

  const plot_id =
    Number(
      form.get("plot_id")
    );

  const kode_sampel =
    String(
      form.get("kode_sampel") || ""
    ).trim();

  const keterangan =
    String(
      form.get("keterangan") || ""
    ).trim();


  // ------------------------------------------------------
  // VALIDASI DASAR
  // ------------------------------------------------------

  if (
    !pohon_id ||
    !plot_id ||
    !kode_sampel
  ){

    return new Response(
      "Data wajib belum lengkap.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // AMBIL DATA POHON
  // ------------------------------------------------------

  const pohon =
    await env.DB
      .prepare(`
        SELECT
          id,
          komoditas,
          varietas,
          blok_id,
          status
        FROM pohon
        WHERE id=?
        LIMIT 1
      `)
      .bind(pohon_id)
      .first();


  if (!pohon){

    return new Response(
      "Pohon tidak ditemukan.",
      {
        status:404,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  if (
    pohon.status !== "aktif"
  ){

    return new Response(
      "Pohon tidak aktif.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // CEK SUDAH MENJADI SAMPEL
  // ------------------------------------------------------

  const existing =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE pohon_id=?
        LIMIT 1
      `)
      .bind(pohon_id)
      .first();


  if (existing){

    return new Response(
      "Pohon ini sudah menjadi pohon sampel.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // AMBIL DATA PLOT
  // ------------------------------------------------------

  const plot =
    await env.DB
      .prepare(`
        SELECT
          id,
          blok_id,
          komoditas,
          varietas,
          status
        FROM plot
        WHERE id=?
        LIMIT 1
      `)
      .bind(plot_id)
      .first();


  if (!plot){

    return new Response(
      "Plot tidak ditemukan.",
      {
        status:404,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  if (
    plot.status !== "aktif"
  ){

    return new Response(
      "Plot tidak aktif.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // VALIDASI BLOK
  // ------------------------------------------------------

  if (
    Number(pohon.blok_id)
    !==
    Number(plot.blok_id)
  ){

    return new Response(
      "Pohon dan Plot berada pada Blok yang berbeda.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // VALIDASI KOMODITAS
  // ------------------------------------------------------

  if (
    String(pohon.komoditas || "")
    !==
    String(plot.komoditas || "")
  ){

    return new Response(
      "Komoditas pohon dan Plot tidak sama.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // VALIDASI VARIETAS
  // ------------------------------------------------------

  if (
    String(pohon.varietas || "")
    !==
    String(plot.varietas || "")
  ){

    return new Response(
      "Varietas pohon dan Plot tidak sama.",
      {
        status:400,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // ------------------------------------------------------
  // SIMPAN
  // ------------------------------------------------------

  try {

    await env.DB
      .prepare(`
        INSERT INTO pohon_sampel (
          plot_id,
          pohon_id,
          kode_sampel,
          status,
          keterangan
        )
        VALUES (?, ?, ?, 'aktif', ?)
      `)
      .bind(
        plot_id,
        pohon_id,
        kode_sampel,
        keterangan || null
      )
      .run();


    return Response.redirect(
      new URL(
        "/pohon-sampel",
        request.url
      ).toString(),
      303
    );


  } catch(error){

    return new Response(
      "Gagal menyimpan pohon sampel: "
      + error.message,
      {
        status:500,
        headers:{
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }

}

// ========================================================
// PENGAMATAN — FORM
// ========================================================

async function pengamatanForm(
  env,
  pohonSampelId,
  data = {}
){

  const sampel =
    await env.DB
      .prepare(`
        SELECT
          ps.id,
          ps.kode_sampel,

          p.kode_pohon,
          p.komoditas,
          p.varietas,

          pl.kode_plot,

          b.kode_blok

        FROM pohon_sampel ps

        JOIN pohon p
          ON p.id = ps.pohon_id

        JOIN plot pl
          ON pl.id = ps.plot_id

        LEFT JOIN blok b
          ON b.id = pl.blok_id

        WHERE ps.id = ?

        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return layout(
      "Pohon Sampel Tidak Ditemukan",

      `
        <div class="card">

          <h2>
            Pohon sampel tidak ditemukan.
          </h2>

          <a
            href="/pohon-sampel"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,

      "pohon-sampel",
      "admin"
    );

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>
          📋 Tambah Pengamatan
        </h1>

        <p>
          ${esc(sampel.kode_sampel)}
          —
          ${esc(sampel.kode_pohon)}
          —
          ${esc(sampel.varietas || "-")}
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/pengamatan/new"
      >

        <div class="form-grid">


          ${field(
            "Tanggal Pengamatan",
            "tanggal_pengamatan",
            data.tanggal_pengamatan || "",
            "date",
            false,
            true
          )}


          ${field(
            "Tinggi (m)",
            "tinggi_m",
            data.tinggi_m ?? "",
            "number"
          )}


          ${field(
            "Diameter Batang (cm)",
            "diameter_batang_cm",
            data.diameter_batang_cm ?? "",
            "number"
          )}


          ${field(
            "Diameter Kanopi (m)",
            "diameter_kanopi_m",
            data.diameter_kanopi_m ?? "",
            "number"
          )}


          ${field(
            "Kondisi Bunga",
            "kondisi_bunga",
            data.kondisi_bunga || ""
          )}


          ${field(
            "Kondisi Buah",
            "kondisi_buah",
            data.kondisi_buah || ""
          )}


          ${field(
            "Jumlah Buah",
            "jumlah_buah",
            data.jumlah_buah ?? "",
            "number"
          )}


          ${field(
            "Kondisi Tanaman",
            "kondisi_tanaman",
            data.kondisi_tanaman || ""
          )}


          ${field(
            "Kondisi Cuaca",
            "kondisi_cuaca",
            data.kondisi_cuaca || ""
          )}


          ${textareaField(
            "Catatan",
            "catatan",
            data.catatan || "",
            true
          )}

        </div>


        ${formButtons(
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
        )}

      </form>

    </div>

  `;


  return layout(
    "Tambah Pengamatan",
    content,
    "pohon-sampel",
    "admin"
  );

}

// ========================================================
// PENGAMATAN — EDIT FORM
// ========================================================

async function pengamatanEditForm(
  env,
  pohonSampelId,
  pengamatanId
){

  const data =
    await env.DB
      .prepare(`
        SELECT
          pg.*,
          ps.kode_sampel,
          p.kode_pohon,
          p.komoditas,
          p.varietas,
          pl.kode_plot,
          b.kode_blok
        FROM pengamatan pg
        JOIN pohon_sampel ps
          ON ps.id = pg.pohon_sampel_id
        JOIN pohon p
          ON p.id = ps.pohon_id
        JOIN plot pl
          ON pl.id = ps.plot_id
        LEFT JOIN blok b
          ON b.id = pl.blok_id
        WHERE pg.id = ?
          AND pg.pohon_sampel_id = ?
          AND ps.status = 'aktif'
        LIMIT 1
      `)
      .bind(
        pengamatanId,
        pohonSampelId
      )
      .first();


  if(!data){

    return layout(
      "Pengamatan Tidak Ditemukan",
      `
        <div class="card">

          <h2>
            Data pengamatan tidak ditemukan.
          </h2>

          <a
            href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,
      "pohon-sampel",
      "admin"
    );

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>
          ✏️ Edit Pengamatan
        </h1>

        <p>
          ${esc(data.kode_sampel)}
          —
          ${esc(data.kode_pohon)}
          —
          ${esc(data.varietas || "-")}
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/pengamatan/${encodeURIComponent(pengamatanId)}/update"
      >

        <div class="form-grid">


          ${field(
            "Tanggal Pengamatan",
            "tanggal_pengamatan",
            data.tanggal_pengamatan || "",
            "date",
            false,
            true
          )}


          ${field(
            "Tinggi (m)",
            "tinggi_m",
            data.tinggi_m ?? "",
            "number"
          )}


          ${field(
            "Diameter Batang (cm)",
            "diameter_batang_cm",
            data.diameter_batang_cm ?? "",
            "number"
          )}


          ${field(
            "Diameter Kanopi (m)",
            "diameter_kanopi_m",
            data.diameter_kanopi_m ?? "",
            "number"
          )}


          ${field(
            "Kondisi Bunga",
            "kondisi_bunga",
            data.kondisi_bunga || ""
          )}


          ${field(
            "Kondisi Buah",
            "kondisi_buah",
            data.kondisi_buah || ""
          )}


          ${field(
            "Jumlah Buah",
            "jumlah_buah",
            data.jumlah_buah ?? "",
            "number"
          )}


          ${field(
            "Kondisi Tanaman",
            "kondisi_tanaman",
            data.kondisi_tanaman || ""
          )}


          ${field(
            "Kondisi Cuaca",
            "kondisi_cuaca",
            data.kondisi_cuaca || ""
          )}


          ${textareaField(
            "Catatan",
            "catatan",
            data.catatan || "",
            true
          )}

        </div>


        ${formButtons(
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
        )}

      </form>

    </div>

  `;


  return layout(
    "Edit Pengamatan",
    content,
    "pohon-sampel",
    "admin"
  );

}

async function fotoPohonSampelForm(
  env,
  pohonSampelId,
  data = {}
){

  const sampel =
    await env.DB
      .prepare(`
        SELECT
          ps.id,
          ps.kode_sampel,

          p.kode_pohon,
          p.komoditas,
          p.varietas,

          pl.kode_plot,

          b.kode_blok

        FROM pohon_sampel ps

        JOIN pohon p
          ON p.id = ps.pohon_id

        JOIN plot pl
          ON pl.id = ps.plot_id

        LEFT JOIN blok b
          ON b.id = pl.blok_id

        WHERE ps.id = ?

        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return layout(
      "Pohon Sampel Tidak Ditemukan",

      `
        <div class="card">

          <h2>
            Pohon sampel tidak ditemukan.
          </h2>

          <a
            href="/pohon-sampel"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,

      "pohon-sampel",
      "admin"
    );

  }


  const content = `

    <div class="page-title">

      <div>

        <h1>
          📷 Tambah Foto
        </h1>

        <p>
          ${esc(sampel.kode_sampel)}
          —
          ${esc(sampel.kode_pohon)}
          —
          ${esc(sampel.varietas || "-")}
        </p>

      </div>

    </div>


    <div class="card">

      <h2>
        Informasi Pohon Sampel
      </h2>

      <div class="form-grid">

        ${field(
          "Kode Sampel",
          "kode_sampel",
          sampel.kode_sampel || "",
          "text",
          true
        )}

        ${field(
          "Kode Pohon",
          "kode_pohon",
          sampel.kode_pohon || "",
          "text",
          true
        )}

        ${field(
          "Komoditas",
          "komoditas",
          sampel.komoditas || "",
          "text",
          true
        )}

        ${field(
          "Varietas",
          "varietas",
          sampel.varietas || "",
          "text",
          true
        )}

        ${field(
          "Plot",
          "kode_plot",
          sampel.kode_plot || "",
          "text",
          true
        )}

        ${field(
          "Blok",
          "kode_blok",
          sampel.kode_blok || "",
          "text",
          true
        )}

      </div>

    </div>


    <div class="card">

      <form
  id="fotoForm"
>

        <div class="form-grid">


          ${field(
            "Tanggal Foto",
            "tanggal_foto",
            data.tanggal_foto || new Date().toISOString().slice(0,10),
            "date",
            false,
            true
          )}


          <div>

            <label>
              Jenis Foto
            </label>

            <select
              name="jenis_foto"
              required
            >

              <option value="">
                Pilih jenis foto
              </option>

              <option value="Tanaman"
                ${data.jenis_foto === "Tanaman" ? "selected" : ""}
              >
                Tanaman
              </option>

              <option value="Daun"
                ${data.jenis_foto === "Daun" ? "selected" : ""}
              >
                Daun
              </option>

              <option value="Bunga"
                ${data.jenis_foto === "Bunga" ? "selected" : ""}
              >
                Bunga
              </option>

              <option value="Buah"
                ${data.jenis_foto === "Buah" ? "selected" : ""}
              >
                Buah
              </option>

              <option value="Batang"
                ${data.jenis_foto === "Batang" ? "selected" : ""}
              >
                Batang
              </option>

              <option value="Penyakit"
                ${data.jenis_foto === "Penyakit" ? "selected" : ""}
              >
                Penyakit
              </option>

              <option value="Lainnya"
                ${data.jenis_foto === "Lainnya" ? "selected" : ""}
              >
                Lainnya
              </option>

            </select>

          </div>


          <div>

            <label>
              Pilih Foto
            </label>

            <input
              type="file"
              name="foto"
              id="foto"
              accept="image/*"
              required
            >

            <small>
              Pilih satu foto untuk pohon sampel.
            </small>

          </div>


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            false
          )}

        </div>


        <div
  id="preview"
  style="
    margin-top:20px;
    margin-bottom:20px;
  "
></div>


        <div class="actions">

  <a
    href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}"
    class="btn btn-secondary"
  >
    ← Batal
  </a>

  <button
    type="submit"
    class="btn btn-primary"
    id="uploadButton"
  >
    ☁️ Upload & Simpan
  </button>

</div>

<div
  id="uploadStatus"
  style="margin-top:15px;"
></div>

      </form>

    </div>


    <script>
      
    async function compressImage(file){

  const maxWidth = 1600;
  const maxHeight = 1600;
  const quality = 0.80;

  const img =
    new Image();

  const objectUrl =
    URL.createObjectURL(file);

  try{

    await new Promise(
      (resolve, reject) => {

        img.onload = resolve;
        img.onerror = reject;

        img.src = objectUrl;

      }
    );

    let width =
      img.naturalWidth;

    let height =
      img.naturalHeight;


    // Hitung ukuran baru
    // tanpa mengubah proporsi

    if(
      width > maxWidth ||
      height > maxHeight
    ){

      const ratio =
        Math.min(
          maxWidth / width,
          maxHeight / height
        );

      width =
        Math.round(
          width * ratio
        );

      height =
        Math.round(
          height * ratio
        );

    }


    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      width;

    canvas.height =
      height;


    const ctx =
      canvas.getContext("2d");

    ctx.drawImage(
      img,
      0,
      0,
      width,
      height
    );


    const blob =
      await new Promise(
        resolve =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            quality
          )
      );


    if(!blob){

      throw new Error(
        "Gagal melakukan kompresi foto."
      );

    }


    return new File(
      [blob],
      "avokoka-foto.jpg",
      {
        type:
          "image/jpeg"
      }
    );

  }finally{

    URL.revokeObjectURL(
      objectUrl
    );

  }

}

      const fotoInput =
        document.getElementById("foto");

      const preview =
        document.getElementById("preview");


      fotoInput.addEventListener(
        "change",
        function(){

          preview.innerHTML = "";

          const file =
            fotoInput.files[0];

          if(!file){

            return;

          }


          const img =
            document.createElement("img");

          img.src =
            URL.createObjectURL(file);

          img.alt =
            "Preview foto";

          img.style.maxWidth =
            "100%";

          img.style.maxHeight =
            "400px";

          img.style.borderRadius =
            "12px";

          img.style.display =
            "block";


          preview.appendChild(img);

        }
      );

      const fotoForm =
  document.getElementById("fotoForm");

const uploadButton =
  document.getElementById("uploadButton");

const uploadStatus =
  document.getElementById("uploadStatus");


fotoForm.addEventListener(
  "submit",
  async function(e){

    e.preventDefault();


    const file =
      fotoInput.files[0];


    if(!file){

      uploadStatus.textContent =
        "❌ Pilih foto terlebih dahulu.";

      return;

    }
          // BATAS UKURAN FOTO ASLI
    const maxFileSize =
      10 * 1024 * 1024; // 10 MB

    if(file.size > maxFileSize){

      uploadStatus.textContent =
        "❌ Ukuran foto terlalu besar. Maksimal 10 MB.";

      return;

    }

    uploadButton.disabled =
      true;

    uploadButton.textContent =
      "⏳ Upload...";

      
        uploadStatus.textContent =
      "🔄 Mengecilkan ukuran foto...";


    const compressedFile =
      await compressImage(file);

       const originalSizeMB =
  (
    file.size /
    (1024 * 1024)
  ).toFixed(2);

const compressedSizeKB =
  (
    compressedFile.size /
    1024
  ).toFixed(0);

const savingPercent =
  Math.max(
    0,
    Math.round(
      (
        1 -
        (
          compressedFile.size /
          file.size
        )
      ) * 100
    )
  );


uploadStatus.textContent =
  "📷 Asli: " +
  originalSizeMB +
  " MB → Kompresi: " +
  compressedSizeKB +
  " KB (" +
  savingPercent +
  "% lebih kecil)";

    try{

      const cloudinaryData =
        new FormData();


      cloudinaryData.append(
  "file",
  compressedFile
);


      cloudinaryData.append(
        "upload_preset",
        "avokoka_upload"
      );


      const cloudinaryResponse =
        await fetch(
          "https://api.cloudinary.com/v1_1/ttkppmx4/image/upload",
          {
            method: "POST",
            body: cloudinaryData
          }
        );


      const cloudinaryResult =
        await cloudinaryResponse.json();


      if(!cloudinaryResponse.ok){

        console.error(
          cloudinaryResult
        );

        throw new Error(
          "Upload Cloudinary gagal."
        );

      }


      const urlFoto =
        cloudinaryResult.secure_url;
        

      uploadStatus.textContent =
        "☁️ Upload berhasil. Menyimpan data...";


      const data =
        new FormData();


      data.append(
        "tanggal_foto",
        document.querySelector(
          '[name="tanggal_foto"]'
        ).value
      );


      data.append(
        "jenis_foto",
        document.querySelector(
          '[name="jenis_foto"]'
        ).value
      );


      data.append(
        "url_foto",
        urlFoto
      );

      data.append(
  "cloudinary_public_id",
  cloudinaryResult.public_id || ""
);

      data.append(
        "keterangan",
        document.querySelector(
          '[name="keterangan"]'
        ).value
      );


      const response =
        await fetch(
          fotoForm.action,
          {
            method: "POST",
            body: data
          }
        );


      if(!response.ok){

        throw new Error(
          "Data foto gagal disimpan."
        );

      }


      uploadStatus.textContent =
        "✅ Foto berhasil disimpan.";


      window.location.href =
        fotoForm.action
          .replace(
            "/foto/new",
            ""
          );


    }catch(error){

      console.error(error);

      uploadStatus.textContent =
        "❌ " + error.message;


      uploadButton.disabled =
        false;

      uploadButton.textContent =
        "☁️ Upload & Simpan";

    }

  }
);

    </script>

  `;


  return layout(
    "Tambah Foto",
    content,
    "pohon-sampel",
    "admin"
  );

}

//=============================================
// FUNGSI FOTO EDIT
//=============================================
async function fotoPohonSampelEditForm(
  env,
  pohonSampelId,
  fotoId
){

  const foto =
    await env.DB
      .prepare(`
        SELECT
          f.*,
          ps.kode_sampel,
          p.kode_pohon,
          p.komoditas,
          p.varietas,
          pl.kode_plot,
          b.kode_blok
        FROM foto_pohon_sampel f
        JOIN pohon_sampel ps
          ON ps.id = f.pohon_sampel_id
        JOIN pohon p
          ON p.id = ps.pohon_id
        JOIN plot pl
          ON pl.id = ps.plot_id
        LEFT JOIN blok b
          ON b.id = pl.blok_id
        WHERE f.id = ?
          AND f.pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        String(fotoId),
        String(pohonSampelId)
      )
      .first();

  if(!foto){

    return layout(
      "Foto Tidak Ditemukan",
      `
        <div class="card">

          <h2>Foto tidak ditemukan.</h2>

          <a
            href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,
      "pohon-sampel",
      "admin"
    );
  }

  const content = `

    <div class="page-title">

      <div>

        <h1>✏️ Edit Foto</h1>

        <p>
          ${esc(foto.kode_sampel)}
          —
          ${esc(foto.kode_pohon)}
          —
          ${esc(foto.varietas || "-")}
        </p>

      </div>

    </div>


    <div class="card">

      <h2>Informasi Pohon Sampel</h2>

      <div class="form-grid">

        ${field(
          "Kode Sampel",
          "kode_sampel",
          foto.kode_sampel || "",
          "text",
          true
        )}

        ${field(
          "Kode Pohon",
          "kode_pohon",
          foto.kode_pohon || "",
          "text",
          true
        )}

        ${field(
          "Komoditas",
          "komoditas",
          foto.komoditas || "",
          "text",
          true
        )}

        ${field(
          "Varietas",
          "varietas",
          foto.varietas || "",
          "text",
          true
        )}

        ${field(
          "Plot",
          "kode_plot",
          foto.kode_plot || "",
          "text",
          true
        )}

        ${field(
          "Blok",
          "kode_blok",
          foto.kode_blok || "",
          "text",
          true
        )}

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/foto/${encodeURIComponent(fotoId)}/update"
      >

        <div class="form-grid">

          ${field(
            "Tanggal Foto",
            "tanggal_foto",
            foto.tanggal_foto || "",
            "date",
            false,
            true
          )}


          <div>

            <label>Jenis Foto</label>

            <select
              name="jenis_foto"
              required
            >

              <option value="">
                Pilih jenis foto
              </option>

              <option
                value="Tanaman"
                ${foto.jenis_foto === "Tanaman" ? "selected" : ""}
              >
                Tanaman
              </option>

              <option
                value="Daun"
                ${foto.jenis_foto === "Daun" ? "selected" : ""}
              >
                Daun
              </option>

              <option
                value="Bunga"
                ${foto.jenis_foto === "Bunga" ? "selected" : ""}
              >
                Bunga
              </option>

              <option
                value="Buah"
                ${foto.jenis_foto === "Buah" ? "selected" : ""}
              >
                Buah
              </option>

              <option
                value="Batang"
                ${foto.jenis_foto === "Batang" ? "selected" : ""}
              >
                Batang
              </option>

              <option
                value="Penyakit"
                ${foto.jenis_foto === "Penyakit" ? "selected" : ""}
              >
                Penyakit
              </option>

              <option
                value="Lainnya"
                ${foto.jenis_foto === "Lainnya" ? "selected" : ""}
              >
                Lainnya
              </option>

            </select>

          </div>


          <div>

            <label>Foto Saat Ini</label>

            <img
              src="${esc(foto.url_foto)}"
              alt="${esc(foto.jenis_foto || "Foto")}"
              style="
                width:160px;
                height:120px;
                object-fit:cover;
                border-radius:8px;
                display:block;
                margin-top:8px;
              "
            >

          </div>


          ${textareaField(
            "Keterangan",
            "keterangan",
            foto.keterangan || "",
            false
          )}

        </div>


        <div class="actions">

          <a
            href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}"
            class="btn btn-secondary"
          >
            ← Batal
          </a>

          <button
            type="submit"
            class="btn btn-primary"
          >
            💾 Simpan Perubahan
          </button>

        </div>

      </form>

    </div>

  `;

  return layout(
    "Edit Foto",
    content,
    "pohon-sampel",
    "admin"
  );
}

//==================================================
// FUNGSI FOTO NEW
//=================================================

async function fotoPohonSampelCreate(
  request,
  env,
  pohonSampelId
){

  const form =
    await request.formData();


  const tanggalFoto =
    String(
      form.get("tanggal_foto") || ""
    ).trim();


  const jenisFoto =
    String(
      form.get("jenis_foto") || ""
    ).trim();


  const urlFoto =
    String(
      form.get("url_foto") || ""
    ).trim();

    const cloudinaryPublicId =
  String(
    form.get("cloudinary_public_id") || ""
  ).trim();


  const keterangan =
    String(
      form.get("keterangan") || ""
    ).trim();


  if(
    !tanggalFoto ||
    !jenisFoto ||
    !urlFoto
  ){

    return new Response(
      "Data foto belum lengkap.",
      {
        status: 400,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  const sampel =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE id = ?
          AND status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return new Response(
      "Pohon sampel tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  const fotoId =
    crypto.randomUUID();


  await env.DB
    .prepare(`
INSERT INTO foto_pohon_sampel (
  id,
  pohon_sampel_id,
  tanggal_foto,
  jenis_foto,
  url_foto,
  cloudinary_public_id,
  keterangan
)
VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      fotoId,
      pohonSampelId,
      tanggalFoto,
      jenisFoto,
      urlFoto,
      cloudinaryPublicId || null,
      keterangan || null
    )
    .run();


  return new Response(
    null,
    {
      status: 303,
      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );

}

//=======================================================
// FOTO UPDATE
//=======================================================
async function fotoPohonSampelUpdate(
  request,
  env,
  pohonSampelId,
  fotoId
){

  const form =
    await request.formData();

  const tanggalFoto =
    String(
      form.get("tanggal_foto") || ""
    ).trim();

  const jenisFoto =
    String(
      form.get("jenis_foto") || ""
    ).trim();

  const keterangan =
    String(
      form.get("keterangan") || ""
    ).trim();

  if(
    !tanggalFoto ||
    !jenisFoto
  ){

    return new Response(
      "Data foto belum lengkap.",
      {
        status: 400,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );
  }


  const foto =
    await env.DB
      .prepare(`
        SELECT id
        FROM foto_pohon_sampel
        WHERE id = ?
          AND pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        String(fotoId),
        String(pohonSampelId)
      )
      .first();


  if(!foto){

    return new Response(
      "Foto tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );
  }


  await env.DB
    .prepare(`
      UPDATE foto_pohon_sampel
      SET
        tanggal_foto = ?,
        jenis_foto = ?,
        keterangan = ?
      WHERE id = ?
        AND pohon_sampel_id = ?
    `)
    .bind(
      tanggalFoto,
      jenisFoto,
      keterangan || null,
      String(fotoId),
      String(pohonSampelId)
    )
    .run();


  return new Response(
    null,
    {
      status: 303,
      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );
}
//========================================================
// DELETE HELPER
//========================================================
async function cloudinaryDeleteImage(
  env,
  publicId
){

  if(!publicId){
    return {
      ok: true,
      skipped: true
    };
  }


  const timestamp =
    Math.floor(
      Date.now() / 1000
    );


  const signatureBase =
  `invalidate=true&public_id=${publicId}&timestamp=${timestamp}` +
  env.CLOUDINARY_API_SECRET;


  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(
        signatureBase
      )
    );


  const hashArray =
    Array.from(
      new Uint8Array(hashBuffer)
    );


  const signature =
    hashArray
      .map(
        b =>
          b.toString(16).padStart(2,"0")
      )
      .join("");


  const form =
    new FormData();


  form.append(
    "public_id",
    publicId
  );

  form.append(
    "timestamp",
    String(timestamp)
  );

  form.append(
    "api_key",
    env.CLOUDINARY_API_KEY
  );

  form.append(
    "signature",
    signature
  );

  form.append(
    "invalidate",
    "true"
  );


  const response =
    await fetch(
      "https://api.cloudinary.com/v1_1/ttkppmx4/image/destroy",
      {
        method: "POST",
        body: form
      }
    );


  const result =
    await response.json();


  if(!response.ok){

  console.error(
    "Cloudinary delete HTTP error:",
    response.status,
    result
  );

  return {
    ok: false,
    result
  };

}


if(
  result.result &&
  result.result !== "ok" &&
  result.result !== "not found"
){

  console.error(
    "Cloudinary delete rejected:",
    result
  );

  return {
    ok: false,
    result
  };

}


  return {
    ok: true,
    result
  };

}

//=========================================================
// FUNGSI FOTO POHON SAMPEL DELETE
//=========================================================
async function fotoPohonSampelDelete(
  request,
  env,
  pohonSampelId,
  fotoId
){

  const foto =
    await env.DB
      .prepare(`
        SELECT
          id,
          cloudinary_public_id
        FROM foto_pohon_sampel
        WHERE id = ?
          AND pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        String(fotoId),
        String(pohonSampelId)
      )
      .first();


  if(!foto){

    return new Response(
      "Foto tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  /*
   * Hapus file dari Cloudinary
   * jika foto memiliki public_id.
   *
   * Foto lama yang belum memiliki
   * public_id tetap bisa dihapus
   * dari D1.
   */

  if(foto.cloudinary_public_id){

    const cloudinary =
      await cloudinaryDeleteImage(
        env,
        String(
          foto.cloudinary_public_id
        )
      );


    if(!cloudinary.ok){

      return new Response(
    "Foto gagal dihapus dari Cloudinary. Data D1 tidak dihapus.",
        {
          status: 502,
          headers: {
            "Content-Type":
              "text/plain; charset=UTF-8"
          }
        }
      );

    }

  }


  /*
   * Setelah Cloudinary berhasil,
   * hapus record dari D1.
   */

  await env.DB
    .prepare(`
      DELETE FROM foto_pohon_sampel
      WHERE id = ?
        AND pohon_sampel_id = ?
    `)
    .bind(
      String(fotoId),
      String(pohonSampelId)
    )
    .run();


  return new Response(
    null,
    {
      status: 303,
      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(
            pohonSampelId
          )}`
      }
    }
  );

}

// ========================================================
// PENGAMATAN — UPDATE
// ========================================================

async function pengamatanUpdate(
  request,
  env,
  pohonSampelId,
  pengamatanId
){

  const form =
    await request.formData();


  const tanggal_pengamatan =
    form.get("tanggal_pengamatan");

  const tinggi_m =
    form.get("tinggi_m");

  const diameter_batang_cm =
    form.get("diameter_batang_cm");

  const diameter_kanopi_m =
    form.get("diameter_kanopi_m");

  const kondisi_bunga =
    form.get("kondisi_bunga");

  const kondisi_buah =
    form.get("kondisi_buah");

  const jumlah_buah =
    form.get("jumlah_buah");

  const kondisi_tanaman =
    form.get("kondisi_tanaman");

  const kondisi_cuaca =
    form.get("kondisi_cuaca");

  const catatan =
    form.get("catatan");


  // ======================================================
  // VALIDASI POHON SAMPEL
  // ======================================================

  const sampel =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE id = ?
          AND status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return layout(
      "Pohon Sampel Tidak Ditemukan",
      `
        <div class="card">

          <h2>
            Pohon sampel tidak ditemukan.
          </h2>

          <a
            href="/pohon-sampel"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,
      "pohon-sampel",
      "admin"
    );

  }


  // ======================================================
  // VALIDASI DATA PENGAMATAN
  // ======================================================

  const existing =
    await env.DB
      .prepare(`
        SELECT id
        FROM pengamatan
        WHERE id = ?
          AND pohon_sampel_id = ?
        LIMIT 1
      `)
      .bind(
        pengamatanId,
        pohonSampelId
      )
      .first();


  if(!existing){

    return layout(
      "Pengamatan Tidak Ditemukan",
      `
        <div class="card">

          <h2>
            Data pengamatan tidak ditemukan.
          </h2>

          <a
            href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
      `,
      "pohon-sampel",
      "admin"
    );

  }


  // ======================================================
  // VALIDASI TANGGAL
  // ======================================================

  if(!tanggal_pengamatan){

    return layout(
      "Tanggal Pengamatan Wajib",
      `
        <div class="card">

          <h2>
            Tanggal pengamatan wajib diisi.
          </h2>

          <a
            href="/pohon-sampel/${encodeURIComponent(pohonSampelId)}/pengamatan/${encodeURIComponent(pengamatanId)}/edit"
            class="btn btn-secondary"
          >
            ← Kembali ke Edit
          </a>

        </div>
      `,
      "pohon-sampel",
      "admin"
    );

  }


  // ======================================================
  // UPDATE
  // ======================================================

  await env.DB
    .prepare(`
      UPDATE pengamatan
      SET
        tanggal_pengamatan = ?,
        tinggi_m = ?,
        diameter_batang_cm = ?,
        diameter_kanopi_m = ?,
        kondisi_bunga = ?,
        kondisi_buah = ?,
        jumlah_buah = ?,
        kondisi_tanaman = ?,
        kondisi_cuaca = ?,
        catatan = ?
      WHERE id = ?
        AND pohon_sampel_id = ?
    `)
    .bind(
      tanggal_pengamatan,
      tinggi_m
        ? Number(tinggi_m)
        : null,
      diameter_batang_cm
        ? Number(diameter_batang_cm)
        : null,
      diameter_kanopi_m
        ? Number(diameter_kanopi_m)
        : null,
      kondisi_bunga || null,
      kondisi_buah || null,
      jumlah_buah
        ? Number(jumlah_buah)
        : null,
      kondisi_tanaman || null,
      kondisi_cuaca || null,
      catatan || null,
      pengamatanId,
      pohonSampelId
    )
    .run();


  // ======================================================
  // KEMBALI KE DETAIL POHON SAMPEL
  // ======================================================

  return Response.redirect(
    new URL(
      `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`,
      request.url
    ),
    303
  );

}

// ========================================================
// PENGAMATAN — CREATE
// ========================================================

async function pengamatanCreate(
  request,
  env,
  pohonSampelId
){

  const form =
    await request.formData();


  const tanggal_pengamatan =
    form.get("tanggal_pengamatan")?.trim();


  const tinggi_m =
    form.get("tinggi_m")?.trim();


  const diameter_batang_cm =
    form.get("diameter_batang_cm")?.trim();


  const diameter_kanopi_m =
    form.get("diameter_kanopi_m")?.trim();


  const kondisi_bunga =
    form.get("kondisi_bunga")?.trim();


  const kondisi_buah =
    form.get("kondisi_buah")?.trim();


  const jumlah_buah =
    form.get("jumlah_buah")?.trim();


  const kondisi_tanaman =
    form.get("kondisi_tanaman")?.trim();


  const kondisi_cuaca =
    form.get("kondisi_cuaca")?.trim();


  const catatan =
    form.get("catatan")?.trim();


  // --------------------------------------------------------
  // VALIDASI POHON SAMPEL
  // --------------------------------------------------------

  const sampel =
    await env.DB
      .prepare(`
        SELECT id
        FROM pohon_sampel
        WHERE id = ?
          AND status = 'aktif'
        LIMIT 1
      `)
      .bind(pohonSampelId)
      .first();


  if(!sampel){

    return new Response(
      "Pohon sampel tidak ditemukan.",
      {
        status: 404,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // --------------------------------------------------------
  // VALIDASI TANGGAL
  // --------------------------------------------------------

  if(!tanggal_pengamatan){

    return new Response(
      "Tanggal pengamatan wajib diisi.",
      {
        status: 400,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }


  // --------------------------------------------------------
  // INSERT
  // --------------------------------------------------------

  await env.DB
    .prepare(`
      INSERT INTO pengamatan (

        pohon_sampel_id,

        tanggal_pengamatan,

        tinggi_m,

        diameter_batang_cm,

        diameter_kanopi_m,

        kondisi_bunga,

        kondisi_buah,

        jumlah_buah,

        kondisi_tanaman,

        kondisi_cuaca,

        catatan

      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(

      pohonSampelId,

      tanggal_pengamatan,

      tinggi_m
        ? Number(tinggi_m)
        : null,

      diameter_batang_cm
        ? Number(diameter_batang_cm)
        : null,

      diameter_kanopi_m
        ? Number(diameter_kanopi_m)
        : null,

      kondisi_bunga || null,

      kondisi_buah || null,

      jumlah_buah
        ? Number(jumlah_buah)
        : null,

      kondisi_tanaman || null,

      kondisi_cuaca || null,

      catatan || null

    )
    .run();


  // --------------------------------------------------------
  // KEMBALI KE DETAIL
  // --------------------------------------------------------

  return new Response(
    null,
    {
      status: 303,
      headers: {
        Location:
          `/pohon-sampel/${encodeURIComponent(pohonSampelId)}`
      }
    }
  );

}



export {
  cloudinaryDeleteImage,
  fotoPohonSampelCreate,
  fotoPohonSampelDelete,
  fotoPohonSampelEditForm,
  fotoPohonSampelForm,
  fotoPohonSampelUpdate,
  panenRisetCreate,
  panenRisetDelete,
  panenRisetEditForm,
  panenRisetForm,
  panenRisetUpdate,
  pengamatanCreate,
  pengamatanEditForm,
  pengamatanForm,
  pengamatanUpdate,
  pohonSampelCreate,
  pohonSampelDetail,
  pohonSampelForm,
  pohonSampelList,
};
