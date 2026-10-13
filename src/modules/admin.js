import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSession,
  formToObject,
  html,
  layout,
  loginPage,
} from "./core.js";

// ROUTE HELPER
// ============================================================

function cleanPath(pathname) {

  if (!pathname) return "/";

  let path = pathname;

  // Hilangkan trailing slash kecuali root
  if (path.length > 1) {
    path = path.replace(/\/+$/, "");
  }

  return path || "/";
}


function isArticlePath(path) {

  return (
    path === "/artikel" ||
    path === "/artikel/new" ||
    path.startsWith("/artikel/")
  );
}


function isUserManagementPath(path) {

  return (
    path === "/users" ||
    path === "/users/new" ||
    path.startsWith("/users/")
  );
}


// ============================================================
// LOGIN ADMIN
// ============================================================

async function adminLogin(
  request,
  env
) {

  const data =
    await formToObject(request);

  const password =
    data.password || "";

  if (
    !env.ADMIN_PASSWORD ||
    !env.ADMIN_SECRET
  ) {

    return html(
      loginPage(
        "ADMIN_PASSWORD atau ADMIN_SECRET belum dikonfigurasi."
      ),
      500
    );
  }

  if (password !== env.ADMIN_PASSWORD) {

    return html(
      loginPage(
        "Password admin salah."
      ),
      401
    );
  }

  const token =
    await createSession(env);

  const headers =
    new Headers();

  headers.set(
    "Location",
    "/"
  );

  headers.append(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Max-Age=${Math.floor(
        SESSION_MAX_AGE / 1000
      )}`
    ].join("; ")
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
// ADMIN LOGIN GET
// ============================================================

async function adminLoginPage() {

  return html(
    loginPage()
  );
}


async function cloudinaryTestPage(){

  const content = `
    <div class="page-title">
      <div>
        <h1>
          ☁️ Test Upload Cloudinary
        </h1>

        <p>
          Uji upload foto sebelum diintegrasikan
          ke Pohon Sampel.
        </p>
      </div>
    </div>

    <div class="card">

      <form id="cloudinaryForm">

        <div class="form-grid">

          <div>

            <label>
              Pilih Foto
            </label>

            <input
              type="file"
              id="foto"
              accept="image/*"
              required
            >

          </div>

        </div>

        <div class="actions">

          <button
            type="submit"
            class="btn btn-primary"
          >
            ☁️ Upload Foto
          </button>

        </div>

      </form>

      <div
        id="status"
        style="margin-top:20px;"
      ></div>

      <div
        id="hasil"
        style="margin-top:20px;"
      ></div>

    </div>

    <script>

      const form =
        document.getElementById("cloudinaryForm");

      const status =
        document.getElementById("status");

      const hasil =
        document.getElementById("hasil");


      form.addEventListener(
        "submit",
        async function(e){

          e.preventDefault();

          const file =
            document.getElementById("foto").files[0];

          if(!file){

            status.textContent =
              "❌ Pilih foto terlebih dahulu.";

            return;
          }


          status.textContent =
            "⏳ Sedang upload...";

          hasil.innerHTML = "";


          try{

            const formData =
              new FormData();

            formData.append(
              "file",
              file
            );

            formData.append(
              "upload_preset",
              "avokoka_upload"
            );


            const response =
              await fetch(
                "https://api.cloudinary.com/v1_1/ttkppmx4/image/upload",
                {
                  method: "POST",
                  body: formData
                }
              );


            const result =
              await response.json();


            if(!response.ok){

              console.error(result);

              status.textContent =
                "❌ Upload gagal.";

              hasil.textContent =
                JSON.stringify(
                  result,
                  null,
                  2
                );

              return;
            }


            status.textContent =
              "✅ Upload berhasil.";


            const img =
              document.createElement("img");

            img.src =
              result.secure_url;

            img.alt =
              "Foto hasil upload";

            img.style.maxWidth =
              "100%";

            img.style.maxHeight =
              "400px";

            img.style.borderRadius =
              "12px";

            img.style.display =
              "block";

            img.style.marginBottom =
              "15px";


            hasil.appendChild(img);


            const label =
              document.createElement("p");

            label.textContent =
              "URL Foto:";

            hasil.appendChild(label);


            const textarea =
              document.createElement("textarea");

            textarea.readOnly = true;

            textarea.style.width =
              "100%";

            textarea.style.minHeight =
              "80px";

            textarea.value =
              result.secure_url;

            hasil.appendChild(textarea);


          }catch(error){

            console.error(error);

            status.textContent =
              "❌ Terjadi kesalahan.";

            hasil.textContent =
              String(error);

          }

        }
      );

    </script>
  `;


  return layout(
    "Test Upload Cloudinary",
    content,
    "",
    "admin"
  );

}

// ============================================================


export {
  adminLogin,
  adminLoginPage,
  cleanPath,
  cloudinaryTestPage,
  isArticlePath,
  isUserManagementPath,
};
