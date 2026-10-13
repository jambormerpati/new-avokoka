import {
  adminLogin,
  adminLoginPage,
  cleanPath,
  cloudinaryTestPage,
  isArticlePath,
  isUserManagementPath,
} from "./modules/admin.js";

import {
  articleDate,
  articleStatusBadge,
  artikelDelete,
  artikelForm,
  artikelList,
  artikelPublish,
  artikelSave,
  slugify,
} from "./modules/artikel.js";

import {
  catatanCreate,
  catatanDelete,
  catatanEditPage,
  catatanForm,
  catatanList,
  catatanUpdate,
} from "./modules/catatan.js";

import {
  articleOwnerWhere,
  articleStatusForAccess,
  bibitOptions,
  blokAktifkan,
  blokCreate,
  blokEdit,
  blokEditPage,
  blokForm,
  blokLabel,
  blokList,
  blokNonaktifkan,
  blokOptions,
  checkSession,
  checkUserSession,
  clearUserSessionCookie,
  countTable,
  createSession,
  createUserSession,
  dashboard,
  dateToday,
  deleteUserSession,
  esc,
  formToObject,
  generateUserToken,
  getArticleAuthorId,
  getArticleAuthorName,
  getArticleForAccess,
  getArticlesForAccess,
  getBibit,
  getBlok,
  getBlokAktif,
  getPohon,
  getUserSessionToken,
  hashUserPassword,
  hmac,
  html,
  isAdminAccess,
  isAdminSession,
  isArticleOwner,
  isUserAccess,
  isUserRole,
  layout,
  loginPage,
  loginUser,
  makeId,
  num,
  pohonOptions,
  redirect,
  requireAdmin,
  requireArticleAccess,
  requireArticleOwner,
  requireUser,
  userLoginPage,
  userSessionCookie,
  verifyUserPassword,
} from "./modules/core.js";

import {
  fotoDelete,
  fotoEditPage,
  fotoForm,
  fotoList,
  fotoSave,
  fotoUpdate,
} from "./modules/foto.js";

import {
  dbErrorMessage,
  dbErrorPage,
  field,
  formButtons,
  insertCompatible,
  selectField,
  tableColumns,
  textareaField,
} from "./modules/helpers-db.js";

import {
  nurseryCreate,
  nurseryEditPage,
  nurseryForm,
  nurseryList,
  nurseryUpdate,
} from "./modules/nursery.js";

import {
  panenCreate,
  panenDelete,
  panenEditPage,
  panenForm,
  panenList,
  panenUpdate,
} from "./modules/panen.js";

import {
  pemeliharaanCreate,
  pemeliharaanDelete,
  pemeliharaanEditPage,
  pemeliharaanForm,
  pemeliharaanList,
  pemeliharaanUpdate,
} from "./modules/pemeliharaan.js";

import {
  pemupukanCreate,
  pemupukanEditPage,
  pemupukanForm,
  pemupukanList,
  pemupukanUpdate,
} from "./modules/pemupukan.js";

import {
  penyakitCreate,
  penyakitEditPage,
  penyakitForm,
  penyakitList,
  penyakitUpdate,
} from "./modules/penyakit.js";

import {
  penyiramanCreate,
  penyiramanEditPage,
  penyiramanForm,
  penyiramanList,
  penyiramanUpdate,
} from "./modules/penyiraman.js";

import {
  plotAktifkan,
  plotCreate,
  plotEdit,
  plotEditPage,
  plotForm,
  plotList,
  plotNonaktifkan,
} from "./modules/plot.js";

import {
  pohonCreate,
  pohonEdit,
  pohonEditPage,
  pohonForm,
  pohonKartuIdentitas,
  pohonList,
  pohonNonaktifkan,
} from "./modules/pohon.js";

import {
  produksiCreate,
  produksiEditPage,
  produksiForm,
  produksiList,
  produksiUpdate,
} from "./modules/produksi.js";

import {
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
} from "./modules/riset.js";

import {
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
} from "./modules/users.js";

import {
  APP_NAME,
  APP_TITLE,
  CSS,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  USER_SESSION_COOKIE,
  USER_SESSION_MAX_AGE,
} from "./modules/core.js";

// ROUTER UTAMA
// ============================================================

export default {

  async fetch(
    request,
    env,
    ctx
  ) {

    const url =
      new URL(request.url);

    const path =
      cleanPath(url.pathname);

    const method =
      request.method.toUpperCase();


  
    // --------------------------------------------------------
    // ADMIN LOGIN
    // --------------------------------------------------------

    if (
      path === "/login" &&
      method === "GET"
    ) {

      const adminSession =
        await checkSession(
          request,
          env
        );

      if (adminSession) {
        return redirect(
          request,
          "/"
        );
      }

      return adminLoginPage();
    }


    if (
      path === "/login" &&
      method === "POST"
    ) {

      return adminLogin(
        request,
        env
      );
    }

// ========================================================
// CLOUDINARY TEST
// ========================================================

if (
  path === "/cloudinary-test" &&
  method === "GET"
) {

  const adminSession =
    await checkSession(
      request,
      env
    );

  if (!adminSession) {
    return redirect(
      request,
      "/login"
    );
  }

  return html(
    await cloudinaryTestPage()
  );
}

    // --------------------------------------------------------
    // USER LOGIN
    // --------------------------------------------------------

    if (
      path === "/user-login" &&
      method === "GET"
    ) {

      const userSession =
        await checkUserSession(
          request,
          env
        );

      if (
        userSession &&
        userSession.role === "user"
      ) {

        return redirect(
          request,
          "/artikel"
        );
      }

      return html(
        userLoginPage()
      );
    }


    if (
      path === "/user-login" &&
      method === "POST"
    ) {

      return userLogin(
        request,
        env
      );
    }


    // --------------------------------------------------------
    // ROUTER LOGOUT
    // --------------------------------------------------------

    if (
      path === "/logout"
    ) {

      return adminLogout(
        request,
        env
      );
    }


    if (
      path === "/user-logout"
    ) {

      return userLogout(
        request,
        env
      );
    }


    // ========================================================
    // CHECK SESSION
    // ========================================================

    const adminLogged =
      await checkSession(
        request,
        env
      );

    const userSession =
      await checkUserSession(
        request,
        env
      );

    const isAdmin =
      !!adminLogged;

    const isUser =
      !!(
        userSession &&
        userSession.role === "user"
      );


    // ========================================================
    // UNAUTHENTICATED
    // ========================================================

    if (
      !isAdmin &&
      !isUser
    ) {

      return redirect(
        request,
        isArticlePath(path)
          ? "/user-login"
          : "/login"
      );
    }


    // ========================================================
    // USER ACCESS CONTROL
    // ========================================================

    // User langsung ke Artikel
    if (
      !isAdmin &&
      isUser &&
      path === "/"
    ) {

      return redirect(
        request,
        "/artikel"
      );
    }

    
// ============================================================
// USER — ACCOUNT PASSWORD
// ============================================================

if (
  path === "/account/password" &&
  method === "GET"
) {
  if (!isUser) {
    return redirect(
      request,
      "/user-login"
    );
  }

  return html(
  await userChangePasswordForm()
);
}

// User hanya boleh mengakses Artikel
// dan halaman Ganti Password

if (
  !isAdmin &&
  isUser &&
  path !== "/account/password" &&
  !isArticlePath(path)
) {
  return forbiddenPage(
    "Akun User hanya memiliki akses ke modul Artikel."
  );
}


    // ========================================================
    // ADMIN DASHBOARD
    // ========================================================

    if (
      path === "/" &&
      method === "GET"
    ) {

      if (!isAdmin) {
        return redirect(
          request,
          "/artikel"
        );
      }

      return html(
        await dashboard(env)
      );
    }


    // ========================================================
    // ROUTER POHON
    // ========================================================

    if (
      path === "/pohon" &&
      method === "GET"
    ) {

      return html(
        await pohonList(env)
      );
    }


    if (
      (path === "/pohon/new" || path === "/pohon/tambah") &&
      method === "GET"
    ) {

      return html(
        await pohonForm(
          env,
          {},
          false
        )
      );
    }


    if (
      (path === "/pohon/new" || path === "/pohon/tambah") &&
      method === "POST"
    ) {

      return pohonCreate(
        request,
        env
      );
    }


    if (
      path.match(/^\/pohon\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await pohonEditPage(
          env,
          id
        )
      );
    }

    if (
  path.match(/^\/pohon\/[^/]+\/kartu$/) &&
  method === "GET"
) {

  const kode =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await pohonKartuIdentitas(
      env,
      kode
    )
  );

}
/* UPDATE POHON */
if (
  path === "/pohon/edit" &&
  method === "POST"
) {

  return pohonEdit(
    request,
    env
  );
}

    if (
      path.match(/^\/pohon\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return pohonEdit(
        request,
        env,
        id
      );
    }


    if (
      path.match(/^\/pohon\/[^/]+\/nonaktifkan$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return pohonNonaktifkan(
        request,
        env,
        id
      );
    }

// ========================================================
// ROUTER POHON SAMPEL
// ========================================================

if (
  path === "/pohon-sampel" &&
  method === "GET"
) {

  return html(
    await pohonSampelList(env)
  );

}

// ========================================================
// ROUTE POHON SAMPEL — CREATE
// ========================================================

if (
  path === "/pohon-sampel/new" &&
  method === "POST"
) {

  return pohonSampelCreate(
    request,
    env
  );

}


if (
  path === "/pohon-sampel/new" &&
  method === "GET"
) {

  return html(
    await pohonSampelForm(env)
  );

}

// ========================================================
// ROUTE PENGAMATAN — NEW
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/pengamatan\/new$/) &&
  method === "GET"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await pengamatanForm(
      env,
      id
    )
  );

}

// ========================================================
// POHON SAMPEL — DETAIL
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+$/) &&
  method === "GET"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await pohonSampelDetail(
      env,
      id
    )
  );

}


// ========================================================
// ROUTE PENGAMATAN — EDIT
// ========================================================

if (
  path.match(
    /^\/pohon-sampel\/[^/]+\/pengamatan\/[^/]+\/edit$/
  ) &&
  method === "GET"
) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(
      parts[2]
    );

  const pengamatanId =
    decodeURIComponent(
      parts[4]
    );

  return html(
    await pengamatanEditForm(
      env,
      pohonSampelId,
      pengamatanId
    )
  );
}

// ========================================================
// ROUTE PENGAMATAN — UPDATE
// ========================================================

if (
  path.match(
    /^\/pohon-sampel\/[^/]+\/pengamatan\/[^/]+\/update$/
  ) &&
  method === "POST"
) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(
      parts[2]
    );

  const pengamatanId =
    decodeURIComponent(
      parts[4]
    );

  return pengamatanUpdate(
    request,
    env,
    pohonSampelId,
    pengamatanId
  );
}

//========================================================
// Route Foto Sampel
//=========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/foto\/new$/) &&
  method === "GET"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await fotoPohonSampelForm(
      env,
      id
    )
  );
}

// ========================================================
// ROUTE FOTO EDIT
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/foto\/new$/) &&
  method === "POST"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return fotoPohonSampelCreate(
    request,
    env,
    id
  );
}

if (
  path.match(
    /^\/pohon-sampel\/[^/]+\/foto\/[^/]+\/edit$/
  ) &&
  method === "GET"
) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const fotoId =
    decodeURIComponent(parts[4]);

  return html(
    await fotoPohonSampelEditForm(
      env,
      pohonSampelId,
      fotoId
    )
  );
}

if (
  path.match(
    /^\/pohon-sampel\/[^/]+\/foto\/[^/]+\/update$/
  ) &&
  method === "POST"
) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const fotoId =
    decodeURIComponent(parts[4]);

  return fotoPohonSampelUpdate(
    request,
    env,
    pohonSampelId,
    fotoId
  );
}

//=========================================================
// ROUTE FOTO DELETE
//=========================================================
if (
  path.match(
    /^\/pohon-sampel\/[^/]+\/foto\/[^/]+\/delete$/
  ) &&
  method === "POST"
) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const fotoId =
    decodeURIComponent(parts[4]);

  return fotoPohonSampelDelete(
    request,
    env,
    pohonSampelId,
    fotoId
  );
}

// ========================================================
// PENGAMATAN — CREATE
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/pengamatan\/new$/) &&
  method === "POST"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return pengamatanCreate(
    request,
    env,
    id
  );

}

// ========================================================
// PANEN RISET — NEW
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/panen-riset\/new$/) &&
  method === "GET"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await panenRisetForm(
      env,
      id
    )
  );
}

// ========================================================
// PANEN RISET — EDIT
// ========================================================

if (

  path.match(
    /^\/pohon-sampel\/[^/]+\/panen-riset\/[^/]+\/edit$/
  ) &&

  method === "GET"

) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const panenId =
    decodeURIComponent(parts[4]);

  return html(

    await panenRisetEditForm(
      env,
      pohonSampelId,
      panenId
    )

  );

}

// ========================================================
// PANEN RISET — UPDATE
// ========================================================

if (

  path.match(
    /^\/pohon-sampel\/[^/]+\/panen-riset\/[^/]+\/update$/
  ) &&

  method === "POST"

) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const panenId =
    decodeURIComponent(parts[4]);

  return panenRisetUpdate(
    request,
    env,
    pohonSampelId,
    panenId
  );

}

// ========================================================
// PANEN RISET — DELETE
// ========================================================

if (

  path.match(
    /^\/pohon-sampel\/[^/]+\/panen-riset\/[^/]+\/delete$/
  ) &&

  method === "POST"

) {

  const parts =
    path.split("/");

  const pohonSampelId =
    decodeURIComponent(parts[2]);

  const panenId =
    decodeURIComponent(parts[4]);

  return panenRisetDelete(
    env,
    pohonSampelId,
    panenId
  );

}

// ========================================================
// PANEN RISET — CREATE
// ========================================================

if (
  path.match(/^\/pohon-sampel\/[^/]+\/panen-riset\/new$/) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return panenRisetCreate(
    request,
    env,
    id
  );
}


// ========================================================
// ROUTER BLOK
// ========================================================

if (
  path === "/blok" &&
  method === "GET"
) {

  return html(
    await blokList(env)
  );

}

if (
  path === "/blok/new" &&
  method === "GET"
) {

  return html(
    await blokForm(
      env,
      {},
      false
    )
  );

}
if (
  path === "/blok/create" &&
  method === "POST"
) {

  return blokCreate(
    request,
    env
  );

}

if (
  path.match(
    /^\/blok\/[^/]+\/edit$/
  ) &&
  method === "GET"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await blokEditPage(
      env,
      id
    )
  );

}

if (
  path === "/blok/edit" &&
  method === "POST"
) {

  return blokEdit(
    request,
    env
  );

}

if (
  path.match(
    /^\/blok\/[^/]+\/nonaktifkan$/
  ) &&
  method === "POST"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return blokNonaktifkan(
    request,
    env,
    id
  );

}
if (

  path.match(

    /^\/blok\/[^/]+\/aktifkan$/

  ) &&

  method === "POST"

) {

  const id =

    decodeURIComponent(

      path.split("/")[2]

    );

  return blokAktifkan(

    request,

    env,

    id

  );

}


// ========================================================
// ROUTER PLOT
// ========================================================

if (
  path === "/plot" &&
  method === "GET"
) {
  return html(
    await plotList(env)
  );
}

if (
  path === "/plot/new" &&
  method === "GET"
) {
  return html(
    await plotForm(
      env,
      {},
      false
    )
  );
}

if (
  path === "/plot/create" &&
  method === "POST"
) {
  return plotCreate(
    request,
    env
  );
}

if (
  path.match(
    /^\/plot\/[^/]+\/edit$/
  ) &&
  method === "GET"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await plotEditPage(
      env,
      id
    )
  );
}

if (
  path === "/plot/edit" &&
  method === "POST"
) {
  return plotEdit(
    request,
    env
  );
}

if (
  path.match(
    /^\/plot\/[^/]+\/nonaktifkan$/
  ) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return plotNonaktifkan(
    request,
    env,
    id
  );
}

if (
  path.match(
    /^\/plot\/[^/]+\/aktifkan$/
  ) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return plotAktifkan(
    request,
    env,
    id
  );
}


// ========================================================
// NURSERY
// ========================================================

if (
  path === "/nursery" &&
  method === "GET"
) {

  return html(
    await nurseryList(env)
  );

}

if (
  (path === "/nursery/new" ||
   path === "/nursery/tambah") &&
  method === "GET"
) {

  return html(
    await nurseryForm(
      env,
      {},
      false
    )
  );

}


if (
  (path === "/nursery/new" ||
   path === "/nursery/tambah") &&
  method === "POST"
) {

  return nurseryCreate(
    request,
    env
  );

}


if (
  path.match(/^\/nursery\/[^/]+\/edit$/) &&
  method === "GET"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await nurseryEditPage(
      env,
      id
    )
  );

}


// POST EDIT
if (
  path === "/nursery/edit" &&
  method === "POST"
) {

  return nurseryUpdate(
    request,
    env
  );

}


// POST UPDATE LAMA
if (
  path.match(/^\/nursery\/[^/]+\/update$/) &&
  method === "POST"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return nurseryUpdate(
    request,
    env,
    id
  );

}


    // ========================================================
    // PRODUKSI
    // ========================================================

    if (
      path === "/produksi" &&
      method === "GET"
    ) {

      return html(
        await produksiList(env)
      );
    }


    if (
  (
    path === "/produksi/new" ||
    path === "/produksi/tambah"
  ) &&
  method === "GET"
) {

  return html(
    await produksiForm(
      env,
      {},
      false
    )
  );

}


if (
  (
    path === "/produksi/new" ||
    path === "/produksi/tambah"
  ) &&
  method === "POST"
) {

  return produksiCreate(
    request,
    env
  );

}


    if (
      path.match(/^\/produksi\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await produksiEditPage(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/produksi\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return produksiUpdate(
        request,
        env,
        id
      );
    }
    /* UPDATE PRODUKSI */
if (
  path === "/produksi/edit" &&
  method === "POST"
) {
  return produksiUpdate(request, env);
}


    // ========================================================
    // PEMUPUKAN
    // ========================================================

    if (
  path === "/pemupukan" &&
  method === "GET"
) {
  return html(
    await pemupukanList(env)
  );
}


if (
  (path === "/pemupukan/new" ||
   path === "/pemupukan/tambah") &&
  method === "GET"
) {
  return html(
    await pemupukanForm(
      env,
      {},
      false
    )
  );
}


if (
  (path === "/pemupukan/new" ||
   path === "/pemupukan/tambah") &&
  method === "POST"
) {
  return pemupukanCreate(
    request,
    env
  );
}


    if (
      path.match(/^\/pemupukan\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await pemupukanEditPage(
          env,
          id
        )
      );
    }
   
    /* UPDATE PEMUPUKAN */
if (
  path === "/pemupukan/edit" &&
  method === "POST"
) {

  return pemupukanUpdate(
    request,
    env
  );
}


    if (
      path.match(/^\/pemupukan\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return pemupukanUpdate(
        request,
        env,
        id
      );
    }


    // ========================================================
    // PENYIRAMAN
    // ========================================================

    if (
  path === "/penyiraman" &&
  method === "GET"
) {
  return html(
    await penyiramanList(env)
  );
}


if (
  (path === "/penyiraman/new" ||
   path === "/penyiraman/tambah") &&
  method === "GET"
) {
  return html(
    await penyiramanForm(
      env,
      {},
      false
    )
  );
}


if (
  (path === "/penyiraman/new" ||
   path === "/penyiraman/tambah") &&
  method === "POST"
) {
  return penyiramanCreate(
    request,
    env
  );
}


    if (
      path.match(/^\/penyiraman\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await penyiramanEditPage(
          env,
          id
        )
      );
    }
    
    /* UPDATE PENYIRAMAN */
if (
  path === "/penyiraman/edit" &&
  method === "POST"
) {

  return penyiramanUpdate(
    request,
    env
  );
}


    if (
      path.match(/^\/penyiraman\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return penyiramanUpdate(
        request,
        env,
        id
      );
    }


    // ========================================================
    // PENYAKIT
    // ========================================================

    if (
  path === "/penyakit" &&
  method === "GET"
) {
  return html(
    await penyakitList(env)
  );
}


if (
  (path === "/penyakit/new" ||
   path === "/penyakit/tambah") &&
  method === "GET"
) {
  return html(
    await penyakitForm(
      env,
      {},
      false
    )
  );
}


if (
  (path === "/penyakit/new" ||
   path === "/penyakit/tambah") &&
  method === "POST"
) {
  return penyakitCreate(
    request,
    env
  );
}


      
    if (
  path.match(/^\/penyakit\/[^/]+\/edit$/) &&
  method === "GET"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return html(
    await penyakitEditPage(
      env,
      id
    )
  );
}


/* UPDATE PENYAKIT */
if (
  path === "/penyakit/edit" &&
  method === "POST"
) {

  return penyakitUpdate(
    request,
    env
  );
}


    if (
      path.match(/^\/penyakit\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return penyakitUpdate(
        request,
        env,
        id
      );
    }


    // ========================================================
    // PEMELIHARAAN
    // ========================================================

        if (
      path === "/pemeliharaan" &&
      method === "GET"
    ) {

      return html(
        await pemeliharaanList(env)
      );
    }


    if (
      path === "/pemeliharaan/new" &&
      method === "GET"
    ) {

      return html(
        await pemeliharaanForm(
          env,
          {},
          false
        )
      );
    }


    if (
      path === "/pemeliharaan/new" &&
      method === "POST"
    ) {

      return pemeliharaanCreate(
        request,
        env
      );
    }


    // EDIT PEMELIHARAAN
    if (
      path.match(/^\/pemeliharaan\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await pemeliharaanEditPage(
          env,
          id
        )
      );
    }


    // UPDATE PEMELIHARAAN
    if (
      path === "/pemeliharaan/edit" &&
      method === "POST"
    ) {

      return pemeliharaanUpdate(
        request,
        env
      );
    }
    
    if (
  path.match(/^\/pemeliharaan\/[^/]+\/delete$/) &&
  method === "POST"
) {

  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return pemeliharaanDelete(
    request,
    env,
    id
  );
}

    // UPDATE PEMELIHARAAN - URL LAMA / ID
    if (
      path.match(/^\/pemeliharaan\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return pemeliharaanUpdate(
        request,
        env,
        id
      );
    }


    // ========================================================
    // PANEN
    // ========================================================

    if (
      path === "/panen" &&
      method === "GET"
    ) {

      return html(
        await panenList(env)
      );
    }


    if (
      path === "/panen/new" &&
      method === "GET"
    ) {

      return html(
        await panenForm(
          env,
          {},
          false
        )
      );
    }


    if (
      path === "/panen/new" &&
      method === "POST"
    ) {

      return panenCreate(
        request,
        env
      );
    }


    if (
      path.match(/^\/panen\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await panenEditPage(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/panen\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return panenUpdate(
        request,
        env,
        id
      );
    }

    if (
  path.match(/^\/panen\/[^/]+\/delete$/) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return panenDelete(
    request,
    env,
    id
  );
}


    // ========================================================
    // FOTO
    // ========================================================

    if (
      path === "/foto" &&
      method === "GET"
    ) {

      return html(
        await fotoList(env)
      );
    }


    if (
      path === "/foto/new" &&
      method === "GET"
    ) {

      return html(
        await fotoForm(
          env,
          {},
          false
        )
      );
    }


    if (
      path === "/foto/new" &&
      method === "POST"
    ) {

      return fotoSave(
        request,
        env
      );
    }


    if (
      path.match(/^\/foto\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await fotoEditPage(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/foto\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return fotoUpdate(
        request,
        env,
        id
      );
    }
    
    if (
  path.match(/^\/foto\/[^/]+\/delete$/) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return fotoDelete(
    request,
    env,
    id
  );
}


    // ========================================================
    // CATATAN
    // ========================================================

    if (
      path === "/catatan" &&
      method === "GET"
    ) {

      return html(
        await catatanList(env)
      );
    }


    if (
      path === "/catatan/new" &&
      method === "GET"
    ) {

      return html(
        await catatanForm(
          env,
          {},
          false
        )
      );
    }


    if (
      path === "/catatan/new" &&
      method === "POST"
    ) {

      return catatanCreate(
        request,
        env
      );
    }


    if (
      path.match(/^\/catatan\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await catatanEditPage(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/catatan\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return catatanUpdate(
        request,
        env,
        id
      );
    }
    
    if (
  path.match(/^\/catatan\/[^/]+\/delete$/) &&
  method === "POST"
) {
  const id =
    decodeURIComponent(
      path.split("/")[2]
    );

  return catatanDelete(
    request,
    env,
    id
  );
}

    // ========================================================
    // ARTIKEL
    // ========================================================

    if (
      path === "/artikel" &&
      method === "GET"
    ) {

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      return html(
        await artikelList(
          env,
          access
        )
      );
    }


    if (
      path === "/artikel/new" &&
      method === "GET"
    ) {

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      return html(
        await artikelForm(
          env,
          access,
          {},
          false
        )
      );
    }


    if (
      path === "/artikel/new" &&
      method === "POST"
    ) {

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      return artikelSave(
        request,
        env,
        access
      );
    }


    if (
      path.match(/^\/artikel\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      const article =
        await getArticleForAccess(
          env,
          access,
          id
        );

      if (!article) {

        return forbiddenPage(
          "Artikel tidak ditemukan atau Anda tidak memiliki akses."
        );
      }

      return html(
        await artikelForm(
          env,
          access,
          article,
          true
        )
      );
    }


    if (
      path.match(/^\/artikel\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      return artikelSave(
        request,
        env,
        access,
        id
      );
    }


    if (
      path.match(/^\/artikel\/[^/]+\/publish$/) &&
      method === "POST"
    ) {

      if (!isAdmin) {

        return forbiddenPage(
          "Hanya Admin yang dapat mempublikasikan artikel."
        );
      }

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return artikelPublish(
        request,
        env,
        id
      );
    }


    if (
      path.match(/^\/artikel\/[^/]+\/delete$/) &&
      method === "POST"
    ) {

      const access =
        isAdmin
          ? {
              type:"admin",
              session:true
            }
          : {
              type:"user",
              session:userSession
            };

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return artikelDelete(
        request,
        env,
        access,
        id
      );
    }
    
    // ========================================================
// USER — GANTI PASSWORD
// ========================================================

if (
  path === "/account/password" &&
  method === "GET"
) {

  if (!isUser) {
    return redirect(
      request,
      "/user-login"
    );
  }

  return userChangePasswordForm();
}


if (
  path === "/account/password" &&
  method === "POST"
) {

  if (!isUser) {
    return redirect(
      request,
      "/user-login"
    );
  }

  return userChangePassword(
    request,
    env
  );
}


    // ========================================================
    // USER MANAGEMENT
    // ADMIN ONLY
    // ========================================================

    if (
      isUserManagementPath(path) &&
      !isAdmin
    ) {

      return forbiddenPage(
        "Modul User Management hanya dapat diakses Admin."
      );
    }


    if (
      path === "/users" &&
      method === "GET"
    ) {

      return html(
        await usersList(env)
      );
    }


    if (
      path === "/users/new" &&
      method === "GET"
    ) {

      return html(
        await userForm(
          env,
          {},
          false
        )
      );
    }


    if (
      path === "/users/new" &&
      method === "POST"
    ) {

      return userCreate(
        request,
        env
      );
    }


    if (
      path.match(/^\/users\/[^/]+\/edit$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await userEditPage(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/users\/[^/]+\/update$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return userUpdate(
        request,
        env,
        id
      );
    }


    if (
      path.match(/^\/users\/[^/]+\/reset$/) &&
      method === "GET"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return html(
        await userResetForm(
          env,
          id
        )
      );
    }


    if (
      path.match(/^\/users\/[^/]+\/reset$/) &&
      method === "POST"
    ) {

      const id =
        decodeURIComponent(
          path.split("/")[2]
        );

      return userResetPassword(
        request,
        env,
        id
      );
    }


    // ========================================================
    // 404
    // ========================================================

    return html(
      layout(
        "404",
        `
        <div class="card">

          <div class="notice notice-danger">

            <strong>404 — Halaman tidak ditemukan.</strong>

            <div style="margin-top:8px">
              Path:
              <code>${esc(path)}</code>
            </div>

          </div>

          <div class="actions">

            ${
              isAdmin
                ? `
                  <a
                    href="/"
                    class="btn btn-primary">
                    🏠 Dashboard
                  </a>
                `
                : ""
            }

            <a
              href="/artikel"
              class="btn btn-secondary">
              📰 Artikel
            </a>

          </div>

        </div>
        `,
        "",
        isAdmin ? "admin" : "user"
      ),
      404
    );
  }
};