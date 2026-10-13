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

// 3A. PEMELIHARAAN
// ============================================================

async function pemeliharaanList(env) {

  const result = await env.DB.prepare(`
    SELECT
      pm.*,
      p.kode_pohon,
      p.komoditas,
      p.varietas
    FROM pemeliharaan pm
    LEFT JOIN pohon p ON p.id = pm.pohon_id
    ORDER BY pm.tanggal DESC
  `).all();

  const rows = result.results || [];

  const table = rows.length
    ? `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Pohon</th>
              <th>Kegiatan</th>
              <th>Jenis</th>
              <th>Operator</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>

          ${rows.map(r => `
            <tr>
              <td>${esc(r.tanggal || "")}</td>

              <td>
                <strong>${esc(r.kode_pohon || "-")}</strong>
                <br>
                <small>
                  ${esc(r.komoditas || "")}
                  ${r.varietas ? " · " + esc(r.varietas) : ""}
                </small>
              </td>

              <td>${esc(r.kegiatan || r.jenis_kegiatan || "-")}</td>

              <td>
                <span class="badge badge-green">
                  ${esc(r.jenis || r.kategori || "-")}
                </span>
              </td>

              <td>${esc(r.operator || "-")}</td>

              <td>${esc(r.keterangan || "-")}</td>

              <td>
                <div class="actions">
                  <a
                    href="/pemeliharaan/${encodeURIComponent(r.id)}/edit"
                    class="btn btn-secondary btn-sm">
                    ✏️ Edit
                  </a>

                  <form
                    method="POST"
                    action="/pemeliharaan/${encodeURIComponent(r.id)}/delete"
                    onsubmit="return confirm('Hapus data pemeliharaan ini?')">
                    <button class="btn btn-danger btn-sm" type="submit">
                      🗑️ Hapus
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          `).join("")}

          </tbody>
        </table>
      </div>
    `
    : `<div class="empty">Belum ada data pemeliharaan.</div>`;

  const content = `
    <div class="page-title">
      <div>
        <h1>🔧 Pemeliharaan</h1>
        <p>Catatan kegiatan pemeliharaan tanaman.</p>
      </div>

      <a href="/pemeliharaan/new" class="btn btn-primary">
        ＋ Tambah Pemeliharaan
      </a>
    </div>

    <div class="card">
      ${table}
    </div>
  `;

  return layout("Pemeliharaan", content, "pemeliharaan");
}


async function pemeliharaanForm(
  env,
  data = {},
  edit = false
) {

  const pohon = await getPohon(env);
  const blok = await getBlok(env);

  const pohonId =
    data.pohon_id !== null &&
    data.pohon_id !== undefined
      ? data.pohon_id
      : "";

  const blokId =
    data.blok_id !== null &&
    data.blok_id !== undefined
      ? data.blok_id
      : "";

  const content = `
    <div class="page-title">
      <div>
        <h1>
          ${edit ? "✏️ Edit" : "＋ Tambah"}
          Pemeliharaan
        </h1>

        <p>
          Catat kegiatan pemeliharaan tanaman.
        </p>
      </div>

      <a
        href="/pemeliharaan"
        class="btn btn-secondary"
      >
        ← Kembali
      </a>
    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/pemeliharaan/edit"
            : "/pemeliharaan/new"
        }"
      >

        ${
          edit
            ? `
              <input
                type="hidden"
                name="id"
                value="${esc(data.id || "")}"
              >
            `
            : ""
        }


        <div class="form-grid">

          ${selectField(
            "Pohon",
            "pohon_id",
            pohonOptions(
              pohon,
              pohonId
            ),
            pohonId,
            false,
            true
          )}


          ${selectField(
            "Blok",
            "blok_id",
            blokOptions(
              blok,
              blokId
            ),
            blokId
          )}


          ${field(
            "Tanggal",
            "tanggal",
            data.tanggal ||
              dateToday(),
            "date",
            false,
            true
          )}


          ${field(
            "Kegiatan",
            "kegiatan",
            data.kegiatan || "",
            "text",
            false,
            true
          )}


          ${field(
            "Jenis Kegiatan",
            "jenis_kegiatan",
            data.jenis_kegiatan || "",
            "text"
          )}


          ${field(
            "Hasil",
            "hasil",
            data.hasil || "",
            "text"
          )}


          ${field(
            "Operator",
            "operator",
            data.operator || "",
            "text"
          )}


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            true
          )}

        </div>


        ${formButtons(
          "/pemeliharaan"
        )}

      </form>

    </div>
  `;

  return layout(
    edit
      ? "Edit Pemeliharaan"
      : "Tambah Pemeliharaan",
    content,
    "pemeliharaan"
  );
}

async function pemeliharaanEditPage(env, id) {

  try {

    const data = await env.DB
      .prepare(`
        SELECT *
        FROM pemeliharaan
        WHERE id = ?
        LIMIT 1
      `)
      .bind(id)
      .first();

    if (!data) {

      return html(
        layout(
          "Data Tidak Ditemukan",
          `
          <div class="card">

            <div class="notice notice-danger">
              Data pemeliharaan tidak ditemukan.
            </div>

            <a
              href="/pemeliharaan"
              class="btn btn-secondary"
            >
              ← Kembali
            </a>

          </div>
          `,
          "pemeliharaan",
          "admin"
        ),
        404
      );

    }

    return pemeliharaanForm(
      env,
      data,
      true
    );

  } catch (err) {

    return dbErrorPage(
      "Edit Pemeliharaan",
      err,
      "/pemeliharaan"
    );

  }
}

async function pemeliharaanUpdate(request, env) {

  const data = await formToObject(request);

  if (!data.id) {
    return redirect(
      request,
      "/pemeliharaan"
    );
  }

  try {

    await env.DB.prepare(`
      UPDATE pemeliharaan
      SET
        pohon_id = ?,
        blok_id = ?,
        tanggal = ?,
        kegiatan = ?,
        jenis_kegiatan = ?,
        hasil = ?,
        operator = ?,
        keterangan = ?
      WHERE id = ?
    `).bind(

      data.pohon_id !== ""
        ? Number(data.pohon_id)
        : null,

      data.blok_id !== ""
        ? Number(data.blok_id)
        : null,

      data.tanggal || dateToday(),

      data.kegiatan || null,

      data.jenis_kegiatan || null,

      data.hasil || null,

      data.operator || null,

      data.keterangan || null,

      Number(data.id)

    ).run();

    return redirect(
      request,
      "/pemeliharaan"
    );

  } catch (err) {

    return dbErrorPage(
      "Edit Pemeliharaan",
      err,
      "/pemeliharaan"
    );

  }
}

async function pemeliharaanDelete(request, env, id) {

  try {

    await env.DB
      .prepare(`
        DELETE FROM pemeliharaan
        WHERE id = ?
      `)
      .bind(Number(id))
      .run();

    return redirect(
      request,
      "/pemeliharaan"
    );

  } catch (err) {

    return dbErrorPage(
      "Hapus Pemeliharaan",
      err,
      "/pemeliharaan"
    );

  }
}

async function pemeliharaanCreate(request, env) {

  const data =
    await formToObject(request);

  if (!data.kegiatan) {

    return html(
      layout(
        "Tambah Pemeliharaan",
        `
        <div class="card">

          <div class="notice notice-danger">
            Kegiatan wajib diisi.
          </div>

          <a
            href="/pemeliharaan/tambah"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>

        </div>
        `,
        "pemeliharaan",
        "admin"
      ),
      400
    );

  }

  try {

    await insertCompatible(
      env,
      "pemeliharaan",
      {

        // id sengaja tidak diisi
        // SQLite membuat ID otomatis

        pohon_id:
          data.pohon_id !== ""
            ? Number(data.pohon_id)
            : null,

        blok_id:
          data.blok_id !== ""
            ? Number(data.blok_id)
            : null,

        tanggal:
          data.tanggal || dateToday(),

        kegiatan:
          data.kegiatan || null,

        jenis_kegiatan:
          data.jenis_kegiatan || null,

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
      "/pemeliharaan"
    );

  } catch (err) {

    return dbErrorPage(
      "Tambah Pemeliharaan",
      err,
      "/pemeliharaan/tambah"
    );

  }
}


// ============================================================


export {
  pemeliharaanCreate,
  pemeliharaanDelete,
  pemeliharaanEditPage,
  pemeliharaanForm,
  pemeliharaanList,
  pemeliharaanUpdate,
};
