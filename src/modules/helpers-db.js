import {
  esc,
  html,
  layout,
} from "./core.js";

// 17. FORM FIELD HELPERS
// ============================================================

function field(
  label,
  name,
  value = "",
  type = "text",
  full = false,
  required = false
){

  return `
    <div class="form-group ${full ? "full" : ""}">

      <label>
        ${esc(label)}
        ${required ? " *" : ""}
      </label>

      <input
        class="form-control"
        type="${esc(type)}"
        name="${esc(name)}"
        value="${esc(value)}"
        ${required ? "required" : ""}
      >

    </div>
  `;
}


function selectField(
  label,
  name,
  options,
  value = "",
  full = false,
  required = false
){

  return `
    <div class="form-group ${full ? "full" : ""}">

      <label>
        ${esc(label)}
        ${required ? " *" : ""}
      </label>

      <select
        class="form-control"
        name="${esc(name)}"
        ${required ? "required" : ""}
      >

        ${options}

      </select>

    </div>
  `;
}


function textareaField(
  label,
  name,
  value = "",
  full = true
){

  return `
    <div class="form-group ${full ? "full" : ""}">

      <label>
        ${esc(label)}
      </label>

      <textarea
        class="form-control"
        name="${esc(name)}"
      >${esc(value)}</textarea>

    </div>
  `;
}


function formButtons(back){

  return `
    <div
      class="actions"
      style="margin-top:20px"
    >

      <button
        class="btn btn-primary"
        type="submit"
      >
        💾 Simpan
      </button>

      <a
        href="${back}"
        class="btn btn-secondary"
      >
        Batal
      </a>

    </div>
  `;
}


// ============================================================
// 18. DATABASE ERROR
// ============================================================

function dbErrorMessage(err){

  const raw =
    err && err.message
      ? err.message
      : String(err);

  return raw ||
    "Kesalahan database tidak diketahui.";
}


function dbErrorPage(
  title,
  err,
  back
){

  const message =
    dbErrorMessage(err);

  const active =
    title
      .toLowerCase()
      .includes("nursery")
      ? "nursery"
      : "pohon";


  return html(
    layout(
      title,

      `
      <div class="card">

        <div class="notice notice-danger">

          <strong>
            Gagal menyimpan data.
          </strong>

        </div>


        <div
          class="card"
          style="
            background:#fff8f7;
            border-color:#f2c8c4
          "
        >

          <strong>
            Pesan D1:
          </strong>

          <pre
            style="
              white-space:pre-wrap;
              word-break:break-word;
              margin-top:10px
            "
          >${esc(message)}</pre>

        </div>


        <div class="actions">

          <a
            href="${back}"
            class="btn btn-secondary"
          >
            Kembali
          </a>

        </div>

      </div>
      `,

      active,
      "admin"
    ),

    500
  );
}


// ============================================================
// 19. DATABASE COLUMN HELPER
// ============================================================

async function tableColumns(
  env,
  table
){

  const result =
    await env.DB
      .prepare(
        `PRAGMA table_info(${table})`
      )
      .all();

  return new Set(
    (result.results || [])
      .map(x => x.name)
  );
}


// ============================================================
// 20. INSERT COMPATIBLE
// ============================================================

async function insertCompatible(
  env,
  table,
  values
){

  const cols =
    await tableColumns(
      env,
      table
    );


  const entries =
    Object.entries(values)
      .filter(
        ([key]) => cols.has(key)
      );


  if(!entries.length){

    throw new Error(
      `Tabel ${table} tidak memiliki kolom yang cocok.`
    );

  }


  const names =
    entries.map(
      ([key]) => key
    );


  const params =
    entries.map(
      ([,value]) => value
    );


  const marks =
    names
      .map(() => "?")
      .join(",");


  await env.DB
    .prepare(`
      INSERT INTO ${table}
      (${names.join(",")})
      VALUES (${marks})
    `)
    .bind(...params)
    .run();
}

// ============================================================


export {
  dbErrorMessage,
  dbErrorPage,
  field,
  formButtons,
  insertCompatible,
  selectField,
  tableColumns,
  textareaField,
};
