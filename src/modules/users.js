import {
  checkUserSession,
  clearUserSessionCookie,
  deleteUserSession,
  esc,
  formToObject,
  hashUserPassword,
  html,
  layout,
  loginUser,
  redirect,
  userLoginPage,
  userSessionCookie,
  verifyUserPassword,
} from "./core.js";

import {
  dbErrorPage,
  field,
  formButtons,
  insertCompatible,
  selectField,
} from "./helpers-db.js";

// 4B. USER MANAGEMENT + USER LOGIN + RBAC
// ============================================================


// ------------------------------------------------------------
// USER LIST
// ADMIN ONLY
// ------------------------------------------------------------

async function usersList(env) {

  const result = await env.DB.prepare(`
    SELECT
      id,
      username,
      nama,
      role,
      status
    FROM users
    ORDER BY nama, username
  `).all();

  const rows = result.results || [];

  const table = rows.length
    ? `
      <div class="table-wrap">
        <table>

          <thead>
            <tr>
              <th>Username</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>

          ${rows.map(u => `
            <tr>

              <td>
                <strong>
                  ${esc(u.username || "-")}
                </strong>
              </td>

              <td>
                ${esc(u.nama || "-")}
              </td>

              <td>
                ${
                  u.role === "admin"
                    ? `
                      <span class="badge badge-green">
                        Admin
                      </span>
                    `
                    : `
                      <span class="badge badge-gray">
                        User
                      </span>
                    `
                }
              </td>

              <td>
                ${
                  u.status === "active"
                    ? `
                      <span class="badge badge-green">
                        Aktif
                      </span>
                    `
                    : `
                      <span class="badge badge-red">
                        Nonaktif
                      </span>
                    `
                }
              </td>

              <td>

                <div class="actions">

                  <a
                    href="/users/${encodeURIComponent(u.id)}/edit"
                    class="btn btn-secondary btn-sm">
                    ✏️ Edit
                  </a>

                  <a
                    href="/users/${encodeURIComponent(u.id)}/reset"
                    class="btn btn-warning btn-sm">
                    🔑 Reset Password
                  </a>

                </div>

              </td>

            </tr>
          `).join("")}

          </tbody>

        </table>
      </div>
    `
    : `
      <div class="empty">
        Belum ada user.
      </div>
    `;

  const content = `
    <div class="page-title">

      <div>
        <h1>👥 User</h1>
        <p>
          Kelola akun pengguna Admin Avokoka Kingdom.
        </p>
      </div>

      <a
        href="/users/new"
        class="btn btn-primary">
        ＋ Tambah User
      </a>

    </div>

    <div class="card">
      ${table}
    </div>
  `;

  return layout(
    "User",
    content,
    "",
    "admin"
  );
}


// ------------------------------------------------------------
// USER FORM
// ------------------------------------------------------------

async function userForm(
  env,
  data = {},
  edit = false
) {

  const content = `
    <div class="page-title">

      <div>
        <h1>
          ${edit
            ? "✏️ Edit User"
            : "＋ Tambah User"}
        </h1>

        <p>
          Pengaturan akun pengguna.
        </p>
      </div>

      <a
        href="/users"
        class="btn btn-secondary">
        ← Kembali
      </a>

    </div>

    <div class="card">

      <form
        method="POST"
        action="${edit
          ? `/users/${encodeURIComponent(data.id)}/update`
          : "/users/new"}">

        <div class="form-grid">

          ${field(
            "Username",
            "username",
            data.username || "",
            "text",
            false,
            true
          )}

          ${field(
            "Nama",
            "nama",
            data.nama || "",
            "text",
            false,
            true
          )}

          ${
            !edit
              ? field(
                  "Password",
                  "password",
                  "",
                  "password",
                  false,
                  true
                )
              : `
                <div class="form-group">
                  <label>Password</label>
                  <div style="
                    padding:10px 11px;
                    border:1px solid #dce5df;
                    border-radius:8px;
                    background:#f7f9f8;
                    color:#6b7770;
                    font-size:13px;
                  ">
                    Gunakan menu
                    <strong>Reset Password</strong>
                    untuk mengganti password.
                  </div>
                </div>
              `
          }

          ${selectField(
            "Role",
            "role",
            `
              <option
                value="user"
                ${(data.role || "user") === "user"
                  ? "selected"
                  : ""}>
                User
              </option>

              <option
                value="admin"
                ${data.role === "admin"
                  ? "selected"
                  : ""}>
                Admin
              </option>
            `,
            data.role || "user"
          )}

          ${selectField(
            "Status",
            "status",
            `
              <option
                value="active"
                ${(data.status || "active") === "active"
                  ? "selected"
                  : ""}>
                Aktif
              </option>

              <option
                value="inactive"
                ${data.status === "inactive"
                  ? "selected"
                  : ""}>
                Nonaktif
              </option>
            `,
            data.status || "active"
          )}

        </div>

        ${formButtons("/users")}

      </form>

    </div>
  `;

  return layout(
    edit ? "Edit User" : "Tambah User",
    content,
    "",
    "admin"
  );
}

// ============================================================
// USER — GANTI PASSWORD FORM
// ============================================================

async function userChangePasswordForm() {

  const content = `
    <div class="page-title">
      <div>
        <h1>🔑 Ganti Password</h1>
        <p>Ubah password akun Anda.</p>
      </div>

      <a
        href="/artikel"
        class="btn btn-secondary"
      >
        ← Kembali
      </a>
    </div>

    <div class="card">

      <form
        method="POST"
        action="/account/password"
      >

        <div class="form-grid">

          <div>
            <label>Password Lama</label>
            <input
              type="password"
              name="password_lama"
              required
            >
          </div>

          <div>
            <label>Password Baru</label>
            <input
              type="password"
              name="password"
              required
            >
          </div>

          <div>
            <label>Ulangi Password Baru</label>
            <input
              type="password"
              name="password_confirm"
              required
            >
          </div>

        </div>

        <div style="margin-top:20px;">
          <button
            type="submit"
            class="btn btn-primary"
          >
            🔑 Simpan Password
          </button>

          <a
            href="/artikel"
            class="btn btn-secondary"
          >
            Batal
          </a>
        </div>

      </form>

    </div>
  `;

  return layout(
    "Ganti Password",
    content,
    "artikel",
    "user"
  );
}

// ------------------------------------------------------------
// USER CREATE
// ------------------------------------------------------------

async function userCreate(request, env) {

  const data =
    await formToObject(request);

  const username =
    (data.username || "").trim();

  const nama =
    (data.nama || "").trim();

  const password =
    data.password || "";

  const role =
    data.role === "admin"
      ? "admin"
      : "user";

  const status =
    data.status === "inactive"
      ? "inactive"
      : "active";

  if (!username || !nama || !password) {

    return html(
      layout(
        "User",
        `
        <div class="card">

          <div class="notice notice-danger">
            Username, nama dan password wajib diisi.
          </div>

          <a
            href="/users/new"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      400
    );
  }

  try {

    const exists =
      await env.DB.prepare(`
        SELECT id
        FROM users
        WHERE username=?
        LIMIT 1
      `).bind(username).first();

    if (exists) {

      return html(
        layout(
          "User",
          `
          <div class="card">

            <div class="notice notice-danger">
              Username
              <strong>${esc(username)}</strong>
              sudah digunakan.
            </div>

            <a
              href="/users/new"
              class="btn btn-secondary">
              ← Kembali
            </a>

          </div>
          `,
          "",
          "admin"
        ),
        400
      );
    }

        const passwordHash =
      await hashUserPassword(password);

    await insertCompatible(
      env,
      "users",
      {
        username,
        password_hash: passwordHash,
        nama,
        role,
        status
      }
    );

    return redirect(
      request,
      "/users"
    );

  } catch (err) {

    return dbErrorPage(
      "User",
      err,
      "/users"
    );
  }
}


// ------------------------------------------------------------
// USER EDIT PAGE
// ------------------------------------------------------------

async function userEditPage(
  env,
  id
) {

  const data =
    await env.DB.prepare(`
      SELECT
        id,
        username,
        nama,
        role,
        status
      FROM users
      WHERE id=?
      LIMIT 1
    `).bind(id).first();

  if (!data) {

    return html(
      layout(
        "User",
        `
        <div class="card">

          <div class="notice notice-danger">
            User tidak ditemukan.
          </div>

          <a
            href="/users"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      404
    );
  }

  return userForm(
    env,
    data,
    true
  );
}


// ------------------------------------------------------------
// USER UPDATE
// ------------------------------------------------------------

async function userUpdate(
  request,
  env,
  id
) {

  const data =
    await formToObject(request);

  const username =
    (data.username || "").trim();

  const nama =
    (data.nama || "").trim();

  const role =
    data.role === "admin"
      ? "admin"
      : "user";

  const status =
    data.status === "inactive"
      ? "inactive"
      : "active";

  if (!username || !nama) {

    return html(
      layout(
        "User",
        `
        <div class="card">

          <div class="notice notice-danger">
            Username dan nama wajib diisi.
          </div>

          <a
            href="/users/${encodeURIComponent(id)}/edit"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      400
    );
  }

  try {

    const exists =
      await env.DB.prepare(`
        SELECT id
        FROM users
        WHERE username=?
          AND id<>?
        LIMIT 1
      `).bind(
        username,
        id
      ).first();

    if (exists) {

      return html(
        layout(
          "User",
          `
          <div class="card">

            <div class="notice notice-danger">
              Username
              <strong>${esc(username)}</strong>
              sudah digunakan user lain.
            </div>

            <a
              href="/users/${encodeURIComponent(id)}/edit"
              class="btn btn-secondary">
              ← Kembali
            </a>

          </div>
          `,
          "",
          "admin"
        ),
        400
      );
    }

    await env.DB.prepare(`
      UPDATE users
      SET
        username=?,
        nama=?,
        role=?,
        status=?
      WHERE id=?
    `).bind(
      username,
      nama,
      role,
      status,
      id
    ).run();

    // Jika akun dinonaktifkan,
    // seluruh session User dihapus.
    if (status === "inactive") {

      await env.DB.prepare(`
        DELETE FROM sessions
        WHERE user_id=?
      `).bind(id).run();

    }

    return redirect(
      request,
      "/users"
    );

  } catch (err) {

    return dbErrorPage(
      "User",
      err,
      "/users"
    );
  }
}


// ------------------------------------------------------------
// RESET PASSWORD FORM
// ------------------------------------------------------------

async function userResetForm(
  env,
  id
) {

  const user =
    await env.DB.prepare(`
      SELECT
        id,
        username,
        nama
      FROM users
      WHERE id=?
      LIMIT 1
    `).bind(id).first();

  if (!user) {

    return html(
      layout(
        "Reset Password",
        `
        <div class="card">

          <div class="notice notice-danger">
            User tidak ditemukan.
          </div>

          <a
            href="/users"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      404
    );
  }

  const content = `
    <div class="page-title">

      <div>
        <h1>🔑 Reset Password</h1>

        <p>
          User:
          <strong>${esc(user.username)}</strong>
          · ${esc(user.nama || "")}
        </p>
      </div>

      <a
        href="/users"
        class="btn btn-secondary">
        ← Kembali
      </a>

    </div>

    <div class="card">

      <form
        method="POST"
        action="/users/${encodeURIComponent(id)}/reset">

        <div class="form-grid">

          ${field(
            "Password Baru",
            "password",
            "",
            "password",
            false,
            true
          )}

          ${field(
            "Ulangi Password Baru",
            "password_confirm",
            "",
            "password",
            false,
            true
          )}

        </div>

        ${formButtons("/users")}

      </form>

    </div>
  `;

  return layout(
    "Reset Password",
    content,
    "",
    "admin"
  );
}


// ------------------------------------------------------------
// RESET PASSWORD
// ------------------------------------------------------------

async function userResetPassword(
  request,
  env,
  id
) {

  const data =
    await formToObject(request);

  const password =
    data.password || "";

  const passwordConfirm =
    data.password_confirm || "";

  if (!password) {

    return html(
      layout(
        "Reset Password",
        `
        <div class="card">

          <div class="notice notice-danger">
            Password baru wajib diisi.
          </div>

          <a
            href="/users/${encodeURIComponent(id)}/reset"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      400
    );
  }

  if (password !== passwordConfirm) {

    return html(
      layout(
        "Reset Password",
        `
        <div class="card">

          <div class="notice notice-danger">
            Konfirmasi password tidak sama.
          </div>

          <a
            href="/users/${encodeURIComponent(id)}/reset"
            class="btn btn-secondary">
            ← Kembali
          </a>

        </div>
        `,
        "",
        "admin"
      ),
      400
    );
  }

  try {

    const passwordHash =
      await hashUserPassword(
        password
      );

    await env.DB.prepare(`
      UPDATE users
      SET password_hash=?
      WHERE id=?
    `).bind(
      passwordHash,
      id
    ).run();

    // Semua session lama user
    // dibuat tidak berlaku.
    await env.DB.prepare(`
      DELETE FROM sessions
      WHERE user_id=?
    `).bind(id).run();

    return redirect(
      request,
      "/users"
    );

  } catch (err) {

    return dbErrorPage(
      "Reset Password",
      err,
      "/users"
    );
  }
}


// ============================================================
// USER LOGIN
// ============================================================

async function userLogin(
  request,
  env
) {

  const data =
    await formToObject(request);

  const username =
    (data.username || "").trim();

  const password =
    data.password || "";

  const result =
    await loginUser(
      env,
      username,
      password
    );

  if (!result.success) {

    return html(
      userLoginPage(
        result.error
      ),
      401
    );
  }

  const headers =
    new Headers();

  headers.set(
    "Location",
    "/artikel"
  );

  headers.append(
    "Set-Cookie",
    userSessionCookie(
      result.token
    )
  );

  return new Response(
    null,
    {
      status:302,
      headers
    }
  );
}


// ============================================================
// USER LOGOUT
// ============================================================

async function userLogout(
  request,
  env
) {

  await deleteUserSession(
    request,
    env
  );

  return new Response(
    null,
    {
      status: 302,
      headers: {
        "Location": "/user-login",
        "Set-Cookie":
          clearUserSessionCookie()
      }
    }
  );
}


// ============================================================
// USER — GANTI PASSWORD
// ============================================================

async function userChangePassword(
  request,
  env
) {

  const session =
    await checkUserSession(
      request,
      env
    );

  if (
    !session ||
    session.role !== "user" ||
    !session.user_id
  ) {
    return redirect(
      request,
      "/user-login"
    );
  }

  const data =
    await formToObject(request);

  const passwordLama =
    data.password_lama || "";

  const password =
    data.password || "";

  const passwordConfirm =
    data.password_confirm || "";

  if (!passwordLama) {
    return html(
      layout(
        "Ganti Password",
        `
        <div class="card">
          <div class="notice notice-danger">
            Password lama wajib diisi.
          </div>

          <a
            href="/account/password"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>
        </div>
        `,
        "artikel",
        "user"
      ),
      400
    );
  }

  if (!password) {
    return html(
      layout(
        "Ganti Password",
        `
        <div class="card">
          <div class="notice notice-danger">
            Password baru wajib diisi.
          </div>

          <a
            href="/account/password"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>
        </div>
        `,
        "artikel",
        "user"
      ),
      400
    );
  }

  if (password !== passwordConfirm) {
    return html(
      layout(
        "Ganti Password",
        `
        <div class="card">
          <div class="notice notice-danger">
            Konfirmasi password baru tidak sama.
          </div>

          <a
            href="/account/password"
            class="btn btn-secondary"
          >
            ← Kembali
          </a>
        </div>
        `,
        "artikel",
        "user"
      ),
      400
    );
  }

  try {

    const user =
      await env.DB
        .prepare(`
          SELECT
            id,
            password_hash
          FROM users
          WHERE id=?
          LIMIT 1
        `)
        .bind(session.user_id)
        .first();

    if (!user) {
      return redirect(
        request,
        "/user-login"
      );
    }

    const valid =
      await verifyUserPassword(
        passwordLama,
        user.password_hash
      );

    if (!valid) {
      return html(
        layout(
          "Ganti Password",
          `
          <div class="card">
            <div class="notice notice-danger">
              Password lama salah.
            </div>

            <a
              href="/account/password"
              class="btn btn-secondary"
            >
              ← Kembali
            </a>
          </div>
          `,
          "artikel",
          "user"
        ),
        400
      );
    }

    const passwordHash =
      await hashUserPassword(
        password
      );

    await env.DB
      .prepare(`
        UPDATE users
        SET password_hash=?
        WHERE id=?
      `)
      .bind(
        passwordHash,
        user.id
      )
      .run();

    await env.DB
      .prepare(`
        DELETE FROM sessions
        WHERE user_id=?
      `)
      .bind(user.id)
      .run();

    return redirect(
      request,
      "/user-login"
    );

  } catch (err) {

    return dbErrorPage(
      "Ganti Password",
      err,
      "/artikel"
    );

  }
}



// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout(
  request,
  env
) {

  return new Response(
    null,
    {
      status:302,
      headers:{
        "Location":"/login",
        "Set-Cookie":
          "avokoka_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
      }
    }
  );
}


// ============================================================
// FORBIDDEN PAGE
// ============================================================

function forbiddenPage(
  message = "Anda tidak memiliki akses ke halaman ini."
) {

  return html(
    layout(
      "Akses Ditolak",
      `
      <div class="card">

        <div class="notice notice-danger">

          <strong>403 — Akses Ditolak</strong>

          <div style="margin-top:8px">
            ${esc(message)}
          </div>

        </div>

        <div class="actions">

          <a
            href="/"
            class="btn btn-secondary">
            🏠 Dashboard
          </a>

          <a
            href="/artikel"
            class="btn btn-primary">
            📰 Artikel
          </a>

        </div>

      </div>
      `,
      "",
      "admin"
    ),
    403
  );
}

// ============================================================


export {
  adminLogout,
  forbiddenPage,
  userChangePassword,
  userChangePasswordForm,
  userCreate,
  userEditPage,
  userForm,
  userLogin,
  userLogout,
  userResetForm,
  userResetPassword,
  userUpdate,
  usersList,
};
