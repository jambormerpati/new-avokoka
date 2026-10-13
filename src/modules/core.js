// ============================================================
// 1. KONFIGURASI
// ============================================================

const APP_NAME = "Avokoka Kingdom";
const APP_TITLE = "Admin Avokoka Kingdom";

const SESSION_COOKIE = "avokoka_admin";
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;

const USER_SESSION_COOKIE = "avokoka_user";
const USER_SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;


// ============================================================
// 2. CSS
// ============================================================

const CSS = `
:root{
  --green:#176b3a;
  --green2:#228b4c;
  --dark:#123524;
  --bg:#f4f7f5;
  --white:#ffffff;
  --text:#17231c;
  --muted:#6b7770;
  --border:#dce5df;
  --danger:#b42318;
  --warning:#b76e00;
  --shadow:0 8px 25px rgba(0,0,0,.07);
}

*{
  box-sizing:border-box;
}

html,body{
  margin:0;
  padding:0;
  font-family:Arial,Helvetica,sans-serif;
  background:var(--bg);
  color:var(--text);
}

body{
  min-height:100vh;
}

a{
  color:inherit;
  text-decoration:none;
}

button,
input,
select,
textarea{
  font:inherit;
}

.topbar{
  height:64px;
  background:var(--dark);
  color:white;
  display:flex;
  align-items:center;
  padding:0 18px;
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:1000;
}

.brand{
  font-size:18px;
  font-weight:700;
  margin-left:12px;
}

.menu-btn{
  width:42px;
  height:42px;
  border:0;
  border-radius:10px;
  background:rgba(255,255,255,.1);
  color:white;
  font-size:23px;
  cursor:pointer;
}

.top-right{
  margin-left:auto;
  display:flex;
  align-items:center;
  gap:12px;
}

.admin-label{
  font-size:13px;
  opacity:.8;
}

.sidebar{
  position:fixed;
  top:64px;
  left:0;
  bottom:0;
  width:245px;
  background:#fff;
  border-right:1px solid var(--border);
  overflow-y:auto;
  z-index:900;
  transition:.25s;
}

.sidebar-inner{
  padding:15px 12px 30px;
}

.nav-section{
  font-size:11px;
  font-weight:700;
  color:#89938d;
  text-transform:uppercase;
  padding:14px 10px 7px;
  letter-spacing:.5px;
}

.nav-link{
  display:flex;
  align-items:center;
  gap:10px;
  padding:11px 12px;
  border-radius:9px;
  margin-bottom:3px;
  font-size:14px;
  color:#34423a;
}

.nav-link:hover{
  background:#edf6f0;
  color:var(--green);
}

.nav-link.active{
  background:#e3f3e9;
  color:var(--green);
  font-weight:700;
}

.nav-icon{
  width:24px;
  text-align:center;
}

.main{
  margin-left:245px;
  padding:90px 25px 40px;
  min-height:100vh;
  transition:.25s;
}

.container{
  max-width:1400px;
  margin:auto;
}

.page-title{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:15px;
  margin-bottom:22px;
}

.page-title h1{
  margin:0;
  font-size:27px;
}

.page-title p{
  color:var(--muted);
  margin:5px 0 0;
}

.card{
  background:white;
  border:1px solid var(--border);
  border-radius:14px;
  box-shadow:var(--shadow);
  padding:20px;
  margin-bottom:20px;
}

.stats{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:15px;
  margin-bottom:22px;
}

.stat{
  background:white;
  border:1px solid var(--border);
  border-radius:14px;
  padding:20px;
  box-shadow:var(--shadow);
}

.stat .icon{
  font-size:26px;
}

.stat .number{
  font-size:29px;
  font-weight:700;
  margin-top:8px;
  color:var(--green);
}

.stat .label{
  color:var(--muted);
  font-size:13px;
  margin-top:4px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}

.form-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:15px;
}

.form-group{
  margin-bottom:2px;
}

.form-group.full{
  grid-column:1 / -1;
}

.form-group label{
  display:block;
  font-size:13px;
  font-weight:700;
  margin-bottom:6px;
}

.form-control{
  width:100%;
  border:1px solid #cfdad3;
  border-radius:8px;
  padding:10px 11px;
  background:#fff;
  color:var(--text);
}

.form-control:focus{
  outline:none;
  border-color:var(--green2);
  box-shadow:0 0 0 3px rgba(34,139,76,.1);
}

textarea.form-control{
  min-height:100px;
  resize:vertical;
}

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  border:0;
  border-radius:8px;
  padding:10px 15px;
  cursor:pointer;
  font-weight:700;
  font-size:13px;
}

.btn-primary{
  background:var(--green);
  color:#fff;
}

.btn-primary:hover{
  background:#11562e;
}

.btn-secondary{
  background:#edf1ee;
  color:#34423a;
}

.btn-danger{
  background:#feeceb;
  color:var(--danger);
}

.btn-warning{
  background:#fff3db;
  color:#8a5400;
}

.btn-sm{
  padding:7px 10px;
  font-size:12px;
}

.actions{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}

.table-wrap{
  overflow-x:auto;
}

table{
  width:100%;
  border-collapse:collapse;
  font-size:13px;
}

th{
  background:#f2f6f3;
  text-align:left;
  font-size:12px;
  color:#56645c;
  white-space:nowrap;
}

th,
td{
  padding:11px 10px;
  border-bottom:1px solid var(--border);
  vertical-align:top;
}

tr:hover td{
  background:#fafcfb;
}

.badge{
  display:inline-block;
  padding:4px 8px;
  border-radius:99px;
  font-size:11px;
  font-weight:700;
}

.badge-green{
  background:#e4f5ea;
  color:#176b3a;
}

.badge-gray{
  background:#eef1ef;
  color:#66716b;
}

.badge-red{
  background:#feeceb;
  color:#a71d12;
}

.badge-yellow{
  background:#fff1cf;
  color:#8a5900;
}

/* compatibility aliases */

.badge-success{
  background:#e4f5ea;
  color:#176b3a;
}

.badge-danger{
  background:#feeceb;
  color:#a71d12;
}

.badge-warning{
  background:#fff1cf;
  color:#8a5900;
}

.btn-success{
  background:var(--green);
  color:#fff;
}

.page-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:15px;
  margin-bottom:22px;
}

.text-muted{
  color:var(--muted);
}

.table-responsive{
  overflow-x:auto;
}

.table{
  width:100%;
  border-collapse:collapse;
}

.input{
  width:100%;
  border:1px solid #cfdad3;
  border-radius:8px;
  padding:10px 11px;
  background:#fff;
  color:var(--text);
}

.notice{
  padding:13px 15px;
  border-radius:9px;
  margin-bottom:18px;
  font-size:13px;
}

.notice-info{
  background:#eaf4ff;
  color:#17527c;
}

.notice-danger{
  background:#fff0ef;
  color:#9b251d;
}

.empty{
  text-align:center;
  padding:35px;
  color:var(--muted);
}

.search-box{
  display:flex;
  gap:10px;
  margin-bottom:18px;
}

.search-box input{
  flex:1;
}

.login-page{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:linear-gradient(135deg,#123524,#1d7041);
}

.login-card{
  background:white;
  width:100%;
  max-width:420px;
  border-radius:18px;
  padding:32px;
  box-shadow:0 20px 60px rgba(0,0,0,.25);
}

.login-logo{
  text-align:center;
  font-size:42px;
}

.login-card h1{
  text-align:center;
  margin:10px 0 5px;
  color:var(--dark);
}

.login-card p{
  text-align:center;
  color:var(--muted);
  margin-bottom:25px;
}

.mobile-overlay{
  display:none;
}

.footer{
  margin-top:30px;
  padding:20px 0;
  text-align:center;
  color:#89938d;
  font-size:12px;
}

@media(max-width:1000px){
  .stats{
    grid-template-columns:repeat(3,1fr);
  }
}

@media(max-width:750px){

  .sidebar{
    transform:translateX(-100%);
    box-shadow:10px 0 30px rgba(0,0,0,.15);
  }

  .sidebar.open{
    transform:translateX(0);
  }

  .mobile-overlay{
    position:fixed;
    inset:64px 0 0 0;
    background:rgba(0,0,0,.35);
    z-index:800;
  }

  .mobile-overlay.open{
    display:block;
  }

  .main{
    margin-left:0;
    padding:84px 14px 30px;
  }

  .stats{
    grid-template-columns:repeat(2,1fr);
  }

  .grid,
  .form-grid{
    grid-template-columns:1fr;
  }

  .form-group.full{
    grid-column:auto;
  }

  .page-title,
  .page-header{
    align-items:flex-start;
    flex-direction:column;
  }

  .page-title h1{
    font-size:23px;
  }

  .admin-label{
    display:none;
  }
}

@media(max-width:430px){

  .stats{
    grid-template-columns:1fr 1fr;
    gap:9px;
  }

  .stat{
    padding:14px;
  }

  .stat .number{
    font-size:23px;
  }

  .card{
    padding:15px;
  }
}
`;


// ============================================================
// 3. HELPER
// ============================================================

function esc(value){
  if(value === null || value === undefined) return "";

  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


function num(value){
  if(value === null || value === undefined || value === ""){
    return null;
  }

  const n = Number(value);

  return Number.isFinite(n) ? n : null;
}


function dateToday(){
  return new Intl.DateTimeFormat(
    "en-CA",
    {timeZone:"Asia/Jakarta"}
  ).format(new Date());
}


function makeId(prefix=""){
  return prefix +
    crypto.randomUUID()
      .replaceAll("-","")
      .substring(0,12);
}


async function formToObject(request){

  const form = await request.formData();
  const data = {};

  for(const [key,value] of form.entries()){
    data[key] = String(value);
  }

  return data;
}


function redirect(request,path){

  return Response.redirect(
    new URL(path,request.url).toString(),
    302
  );
}


function html(body,status=200,extraHeaders={}){

  return new Response(
    body,
    {
      status,
      headers:{
        "content-type":"text/html; charset=UTF-8",
        "cache-control":"no-store",
        ...extraHeaders
      }
    }
  );
}


// ============================================================
// 4. HMAC LOGIN ADMIN
// ============================================================

async function hmac(text,secret){

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name:"HMAC",
      hash:"SHA-256"
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(text)
  );

  return Array
    .from(new Uint8Array(signature))
    .map(b=>b.toString(16).padStart(2,"0"))
    .join("");
}


async function createSession(env){

  const payload = `admin:${Date.now()}`;

  const signature = await hmac(
    payload,
    env.ADMIN_SECRET
  );

  return btoa(
    `${payload}.${signature}`
  );
}


async function checkSession(request,env){

  const cookieHeader =
    request.headers.get("Cookie") || "";

  const match =
    cookieHeader.match(
      new RegExp(`${SESSION_COOKIE}=([^;]+)`)
    );

  if(!match) return false;

  try{

    const decoded = atob(match[1]);

    const separator =
      decoded.lastIndexOf(".");

    if(separator === -1) return false;

    const payload =
      decoded.substring(0,separator);

    const signature =
      decoded.substring(separator+1);

    const expected =
      await hmac(
        payload,
        env.ADMIN_SECRET
      );

    if(signature !== expected){
      return false;
    }

    const parts =
      payload.split(":");

    if(
      parts.length !== 2 ||
      parts[0] !== "admin"
    ){
      return false;
    }

    const timestamp =
      Number(parts[1]);

    if(!Number.isFinite(timestamp)){
      return false;
    }

    if(
      Date.now() - timestamp >
      SESSION_MAX_AGE
    ){
      return false;
    }

    return true;

  }catch{
    return false;
  }
}


// ============================================================
// 5. USER SESSION V2.7
// ============================================================

function getUserSessionToken(request){

  const cookieHeader =
    request.headers.get("Cookie") || "";

  const match =
    cookieHeader.match(
      new RegExp(`${USER_SESSION_COOKIE}=([^;]+)`)
    );

  if(!match) return null;

  return match[1];
}


function generateUserToken(){

  const bytes =
    new Uint8Array(32);

  crypto.getRandomValues(bytes);

  return Array
    .from(bytes)
    .map(
      byte =>
        byte.toString(16).padStart(2,"0")
    )
    .join("");
}


async function createUserSession(env,userId){

  const token =
    generateUserToken();

  const expiresAt =
    new Date(
      Date.now() + USER_SESSION_MAX_AGE
    ).toISOString();

  await env.DB
    .prepare(`
      INSERT INTO sessions
      (token,user_id,expires_at)
      VALUES (?,?,?)
    `)
    .bind(
      token,
      userId,
      expiresAt
    )
    .run();

  return {
    token,
    expiresAt
  };
}


async function checkUserSession(request,env){

  const token =
    getUserSessionToken(request);

  if(!token) return null;

  try{

    const result =
      await env.DB
        .prepare(`
          SELECT
            s.id AS session_id,
            s.token,
            s.user_id,
            s.expires_at,
            u.username,
            u.nama,
            u.role,
            u.status
          FROM sessions s
          INNER JOIN users u
            ON u.id=s.user_id
          WHERE s.token=?
          LIMIT 1
        `)
        .bind(token)
        .first();

    if(
      !result ||
      result.status !== "active"
    ){
      return null;
    }

    const expires =
      new Date(result.expires_at).getTime();

    if(!Number.isFinite(expires)){
      return null;
    }

    if(Date.now() >= expires){

      await env.DB
        .prepare(
          `DELETE FROM sessions WHERE token=?`
        )
        .bind(token)
        .run();

      return null;
    }

    return result;

  }catch{
    return null;
  }
}


async function deleteUserSession(request,env){

  const token =
    getUserSessionToken(request);

  if(!token) return;

  try{

    await env.DB
      .prepare(
        `DELETE FROM sessions WHERE token=?`
      )
      .bind(token)
      .run();

  }catch{}
}


function userSessionCookie(token){

  return [
    `${USER_SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(USER_SESSION_MAX_AGE/1000)}`
  ].join("; ");
}


function clearUserSessionCookie(){

  return [
    `${USER_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0"
  ].join("; ");
}


// ============================================================
// 6. USER PASSWORD
// ============================================================

async function hashUserPassword(password){

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(password);

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  const hashArray =
    Array.from(
      new Uint8Array(hashBuffer)
    );

  return hashArray
    .map(
      byte =>
        byte.toString(16).padStart(2,"0")
    )
    .join("");
}


async function verifyUserPassword(
  password,
  passwordHash
){

  const hash =
    await hashUserPassword(password);

  return hash === passwordHash;
}


async function loginUser(
  env,
  username,
  password
){

  if(!username || !password){

    return {
      success:false,
      error:"Username dan password wajib diisi."
    };
  }

  try{

    const user =
      await env.DB
        .prepare(`
          SELECT
            id,
            username,
            password_hash,
            nama,
            role,
            status
          FROM users
          WHERE username=?
          LIMIT 1
        `)
        .bind(username.trim())
        .first();

    if(!user){

      return {
        success:false,
        error:"Username atau password salah."
      };
    }

    if(user.status !== "active"){

      return {
        success:false,
        error:"Akun tidak aktif."
      };
    }

    const valid =
      await verifyUserPassword(
        password,
        user.password_hash
      );

    if(!valid){

      return {
        success:false,
        error:"Username atau password salah."
      };
    }

    const session =
      await createUserSession(
        env,
        user.id
      );

    return {
      success:true,

      user:{
        id:user.id,
        username:user.username,
        nama:user.nama,
        role:user.role
      },

      token:session.token,
      expiresAt:session.expiresAt
    };

  }catch{

    return {
      success:false,
      error:"Terjadi kesalahan saat login."
    };
  }
}


// ============================================================
// 7. ACCESS HELPER
// ============================================================

function isUserRole(session){

  return !!(
    session &&
    session.role === "user"
  );
}


function isAdminSession(adminSession){

  return adminSession === true;
}


async function requireAdmin(request,env){

  const adminSession =
    await checkSession(
      request,
      env
    );

  if(!adminSession){
    return null;
  }

  return {
    type:"admin",
    session:true
  };
}


async function requireUser(request,env){

  const userSession =
    await checkUserSession(
      request,
      env
    );

  if(
    !userSession ||
    userSession.role !== "user"
  ){
    return null;
  }

  return {
    type:"user",
    session:userSession
  };
}


async function requireArticleAccess(
  request,
  env
){

  const adminSession =
    await checkSession(
      request,
      env
    );

  if(adminSession){

    return {
      type:"admin",
      session:true
    };
  }

  const userSession =
    await checkUserSession(
      request,
      env
    );

  if(
    userSession &&
    userSession.role === "user"
  ){

    return {
      type:"user",
      session:userSession
    };
  }

  return null;
}


// ============================================================
// 8. ARTICLE ACCESS / OWNER RBAC
// ============================================================

function isAdminAccess(access){

  return !!(
    access &&
    access.type === "admin"
  );
}


function isUserAccess(access){

  return !!(
    access &&
    access.type === "user"
  );
}


async function requireArticleOwner(
  env,
  access,
  articleId
){

  if(!access) return false;

  if(isAdminAccess(access)){
    return true;
  }

  if(!isUserAccess(access)){
    return false;
  }

  const article =
    await env.DB
      .prepare(`
        SELECT id,author_id
        FROM artikel
        WHERE id=?
        LIMIT 1
      `)
      .bind(articleId)
      .first();

  if(!article){
    return false;
  }

  return Number(article.author_id) ===
         Number(access.session.user_id);
}


// ============================================================
// 9. ARTICLE AUTHOR
// ============================================================

function getArticleAuthorId(access){

  if(!access){
    return null;
  }

  if(isAdminAccess(access)){
    return null;
  }

  if(isUserAccess(access)){
    return access.session.user_id;
  }

  return null;
}


function getArticleAuthorName(access){

  if(!access){
    return "Sapta Sebayang";
  }

  if(isAdminAccess(access)){
    return "Sapta Sebayang";
  }

  if(isUserAccess(access)){

    return (
      access.session.nama ||
      access.session.username ||
      "User"
    );
  }

  return "User";
}


// ============================================================
// 10. ARTICLE ACCESS FILTER
// ============================================================

function articleOwnerWhere(access){

  if(isAdminAccess(access)){

    return {
      sql:"",
      params:[]
    };
  }

  if(isUserAccess(access)){

    return {
      sql:" WHERE author_id = ? ",
      params:[
        access.session.user_id
      ]
    };
  }

  return {
    sql:" WHERE 1 = 0 ",
    params:[]
  };
}


async function getArticlesForAccess(
  env,
  access
){

  const filter =
    articleOwnerWhere(access);

  const result =
    await env.DB
      .prepare(`
        SELECT *
        FROM artikel
        ${filter.sql}
        ORDER BY
          COALESCE(tanggal,created_at) DESC,
          created_at DESC
      `)
      .bind(...filter.params)
      .all();

  return result.results || [];
}


async function getArticleForAccess(
  env,
  access,
  articleId
){

  if(isAdminAccess(access)){

    return await env.DB
      .prepare(`
        SELECT *
        FROM artikel
        WHERE id=?
        LIMIT 1
      `)
      .bind(articleId)
      .first();
  }

  if(isUserAccess(access)){

    return await env.DB
      .prepare(`
        SELECT *
        FROM artikel
        WHERE id=?
          AND author_id=?
        LIMIT 1
      `)
      .bind(
        articleId,
        access.session.user_id
      )
      .first();
  }

  return null;
}


async function isArticleOwner(
  env,
  access,
  articleId
){

  if(isAdminAccess(access)){
    return true;
  }

  if(!isUserAccess(access)){
    return false;
  }

  const article =
    await env.DB
      .prepare(`
        SELECT author_id
        FROM artikel
        WHERE id=?
        LIMIT 1
      `)
      .bind(articleId)
      .first();

  if(!article){
    return false;
  }

  return Number(article.author_id) ===
         Number(access.session.user_id);
}


function articleStatusForAccess(
  access,
  requestedStatus
){

  if(isAdminAccess(access)){

    return requestedStatus === "published"
      ? "published"
      : "draft";
  }

  // User tidak boleh menerbitkan sendiri.
  return "draft";
}

// ============================================================
// 11. LOGIN PAGE ADMIN
// ============================================================

function loginPage(error = "") {

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login - ${APP_NAME}</title>
<style>${CSS}</style>
</head>

<body>

<div class="login-page">

  <div class="login-card">

    <div class="login-logo">🥑</div>

    <h1>${APP_NAME}</h1>

    <p>Administrator Panel</p>

    ${
      error
        ? `<div class="notice notice-danger">
             ${esc(error)}
           </div>`
        : ""
    }

    <form method="POST" action="/login">

      <div
        class="form-group"
        style="margin-bottom:18px"
      >

        <label>Password Admin</label>

        <input
          class="form-control"
          type="password"
          name="password"
          required
          autocomplete="current-password"
          autofocus
        >

      </div>

      <button
        class="btn btn-primary"
        style="width:100%"
        type="submit"
      >
        🔐 Masuk
      </button>

    </form>

  </div>

</div>

</body>
</html>`;
}


// ============================================================
// 12. LOGIN PAGE USER
// ============================================================

function userLoginPage(error = "") {

  return `<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>Login User - ${APP_NAME}</title>

<style>${CSS}</style>

</head>

<body>

<div class="login-page">

  <div class="login-card">

    <div class="login-logo">🌱</div>

    <h1>${APP_NAME}</h1>

    <p>Login User</p>

    ${
      error
        ? `<div class="notice notice-danger">
             ${esc(error)}
           </div>`
        : ""
    }

    <form
      method="POST"
      action="/user-login"
    >

      <div
        class="form-group"
        style="margin-bottom:18px"
      >

        <label>Username</label>

        <input
          class="form-control"
          type="text"
          name="username"
          required
          autocomplete="username"
          autofocus
        >

      </div>


      <div
        class="form-group"
        style="margin-bottom:20px"
      >

        <label>Password</label>

        <input
          class="form-control"
          type="password"
          name="password"
          required
          autocomplete="current-password"
        >

      </div>


      <button
        class="btn btn-primary"
        style="width:100%"
        type="submit"
      >
        🔐 Masuk
      </button>

    </form>


    <div
      style="
        text-align:center;
        margin-top:18px;
        font-size:12px;
        color:var(--muted);
      "
    >

      <a href="/login">
        Login Administrator
      </a>

    </div>

  </div>

</div>

</body>
</html>`;
}


// ============================================================
// 13. LAYOUT UTAMA
// ============================================================

function layout(
  title,
  content,
  active = "",
  role = "admin"
){

  const isUserLayout =
    role === "user";


  const nav = [

    ["dashboard","🏠","Dashboard","/"],

    ["data","","DATA KEBUN",""],

    ["pohon","🌳","Pohon","/pohon"],
    ["pohon-sampel","🌱","Pohon Sampel","/pohon-sampel"],
    ["blok","🌳","Blok","/blok"],
    ["plot","🌳","Plot","/plot"],
    ["nursery","🌱","Nursery","/nursery"],

    ["operasional","","OPERASIONAL",""],

    ["produksi","📦","Produksi","/produksi"],
    ["pemupukan","🧪","Pemupukan","/pemupukan"],
    ["penyiraman","💧","Penyiraman","/penyiraman"],
    ["penyakit","🦠","Penyakit","/penyakit"],
    ["pemeliharaan","🔧","Pemeliharaan","/pemeliharaan"],

    ["hasil","","HASIL KEBUN",""],

    ["panen","🧺","Panen","/panen"],

    ["lainnya","","LAINNYA",""],

    ["foto","📷","Foto","/foto"],
    ["catatan","📝","Catatan","/catatan"],

    ["konten","","KONTEN",""],

    ["artikel","📰","Artikel","/artikel"]

  ];


  // ----------------------------------------------------------
  // USER HANYA MELIHAT ARTIKEL
  // ----------------------------------------------------------

  if(isUserLayout){

    nav.length = 0;

    nav.push([
      "artikel",
      "📰",
      "Artikel",
      "/artikel"
    ]);

  }


  const headerLabel =
    isUserLayout
      ? "User"
      : "Admin";


  const logoutUrl =
    isUserLayout
      ? "/user-logout"
      : "/logout";


  let menu = "";


  for(const item of nav){

    const [
      key,
      icon,
      label,
      url
    ] = item;


    if(!url){

      menu += `
        <div class="nav-section">
          ${esc(label)}
        </div>
      `;

    }else{

      menu += `
        <a
          href="${url}"
          class="nav-link ${
            active === key
              ? "active"
              : ""
          }"
          onclick="closeMenu()"
        >

          <span class="nav-icon">
            ${icon}
          </span>

          <span>
            ${esc(label)}
          </span>

        </a>
      `;

    }

  }


  return `<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
  ${esc(title)} - ${APP_NAME}
</title>

<style>${CSS}</style>

</head>

<body>


<header class="topbar">

  <button
    class="menu-btn"
    onclick="toggleMenu()"
    aria-label="Menu"
  >
    ☰
  </button>


  <div class="brand">
    🥑 ${APP_NAME}
  </div>


  <div class="top-right">

    <span class="admin-label">
      ${headerLabel}
    </span>

    <a
      href="${logoutUrl}"
      class="btn btn-secondary btn-sm"
    >
      Keluar
    </a>

  </div>

</header>


<aside
  id="sidebar"
  class="sidebar"
>

  <div class="sidebar-inner">

    ${menu}

  </div>

</aside>


<div
  id="overlay"
  class="mobile-overlay"
  onclick="closeMenu()"
></div>


<main class="main">

  <div class="container">

    ${content}

    <div class="footer">
      ${APP_NAME}
      · Digital Farm Management
    </div>

  </div>

</main>


<script>

function toggleMenu(){

  const sidebar =
    document.getElementById("sidebar");

  const overlay =
    document.getElementById("overlay");

  sidebar.classList.toggle("open");

  overlay.classList.toggle("open");

}


function closeMenu(){

  const sidebar =
    document.getElementById("sidebar");

  const overlay =
    document.getElementById("overlay");

  sidebar.classList.remove("open");

  overlay.classList.remove("open");

}

</script>


</body>
</html>`;
}


// ============================================================
// 14. DASHBOARD
// ============================================================

async function countTable(
  env,
  table
){

  try{

    const result =
      await env.DB
        .prepare(
          `SELECT COUNT(*) AS total
           FROM ${table}`
        )
        .first();

    return result?.total || 0;

  }catch{

    return 0;

  }
}


async function dashboard(env){

  const [

    pohon,
    nursery,
    produksi,
    pemupukan,
    penyiraman,
    penyakit,
    pemeliharaan,
    panen,
    artikel

  ] = await Promise.all([

    countTable(env,"pohon"),

    countTable(env,"nursery"),

    countTable(env,"produksi"),

    countTable(env,"pemupukan"),

    countTable(env,"penyiraman"),

    countTable(env,"penyakit"),

    countTable(env,"pemeliharaan"),

    countTable(env,"panen"),

    countTable(env,"artikel")

  ]);


  const content = `

<div class="page-title">

  <div>

    <h1>
      Dashboard
    </h1>

    <p>
      Pusat pengelolaan data
      Avokoka Kingdom
    </p>

  </div>

</div>


<div class="stats">


  <div class="stat">

    <div class="icon">
      🌳
    </div>

    <div class="number">
      ${pohon}
    </div>

    <div class="label">
      Pohon
    </div>

  </div>


  <div class="stat">

    <div class="icon">
      🌱
    </div>

    <div class="number">
      ${nursery}
    </div>

    <div class="label">
      Nursery
    </div>

  </div>


  <div class="stat">

    <div class="icon">
      📦
    </div>

    <div class="number">
      ${produksi}
    </div>

    <div class="label">
      Produksi
    </div>

  </div>


  <div class="stat">

    <div class="icon">
      🧪
    </div>

    <div class="number">
      ${pemupukan}
    </div>

    <div class="label">
      Pemupukan
    </div>

  </div>


  <div class="stat">

    <div class="icon">
      💧
    </div>

    <div class="number">
      ${penyiraman}
    </div>

    <div class="label">
      Penyiraman
    </div>

  </div>


  <div class="stat">

    <div class="icon">
      📰
    </div>

    <div class="number">
      ${artikel}
    </div>

    <div class="label">
      Artikel
    </div>

  </div>


</div>


<div class="grid">


  <div class="card">

    <h3>
      🌱 Data Kebun
    </h3>

    <p>
      Kelola identitas pohon
      dan pembibitan.
    </p>

    <div class="actions">

  <a
    href="/pohon"
    class="btn btn-primary"
  >
    🌳 Data Pohon
  </a>

  <a
    href="/pohon-sampel"
    class="btn btn-secondary"
  >
    🌱 Pohon Sampel
  </a>

  <a
    href="/nursery"
    class="btn btn-secondary"
  >
    🌱 Nursery
  </a>

</div>

  </div>


  <div class="card">

    <h3>
      📊 Operasional
    </h3>

    <p>
      Catat aktivitas kebun
      secara terstruktur.
    </p>

    <div class="actions">

      <a
        href="/produksi"
        class="btn btn-primary"
      >
        📦 Produksi
      </a>

      <a
        href="/pemupukan"
        class="btn btn-secondary"
      >
        🧪 Pemupukan
      </a>

      <a
        href="/penyiraman"
        class="btn btn-secondary"
      >
        💧 Penyiraman
      </a>

    </div>

  </div>


  <div class="card">

    <h3>
      🩺 Kesehatan Tanaman
    </h3>

    <p>
      Pencatatan penyakit
      dan pemeliharaan.
    </p>

    <div class="actions">

      <a
        href="/penyakit"
        class="btn btn-primary"
      >
        🦠 Penyakit
      </a>

      <a
        href="/pemeliharaan"
        class="btn btn-secondary"
      >
        🔧 Pemeliharaan
      </a>

    </div>

  </div>


  <div class="card">

    <h3>
      🧺 Hasil Kebun
    </h3>

    <p>
      Catat panen dan
      dokumentasi kebun.
    </p>

    <div class="actions">

      <a
        href="/panen"
        class="btn btn-primary"
      >
        🧺 Panen
      </a>

      <a
        href="/foto"
        class="btn btn-secondary"
      >
        📷 Foto
      </a>

      <a
        href="/catatan"
        class="btn btn-secondary"
      >
        📝 Catatan
      </a>

    </div>

  </div>


</div>
`;


  return layout(
    "Dashboard",
    content,
    "dashboard",
    "admin"
  );
}


// ============================================================
// 15. DROPDOWN DATABASE
// ============================================================

async function getPohon(env){

  const result =
    await env.DB
      .prepare(`
        SELECT
          id,
          kode_pohon,
          komoditas,
          varietas,
          status
        FROM pohon
        ORDER BY kode_pohon
      `)
      .all();

  return result.results || [];
}


async function getBlok(env){

  try{

    const result =
      await env.DB
        .prepare(`
          SELECT *
          FROM blok
          ORDER BY id
        `)
        .all();

    return result.results || [];

  }catch{

    return [];

  }
}

async function getBlokAktif(env){

  try{

    const result =
      await env.DB
        .prepare(`
          SELECT *
          FROM blok
          WHERE status = 'aktif'
          ORDER BY id
        `)
        .all();

    return result.results || [];

  }catch{

    return [];

  }
}

async function blokForm(
  env,
  data = {},
  edit = false
){

  const title =
    edit
      ? "Edit Blok"
      : "Tambah Blok";

  const content = `

    <div class="page-title">

      <div>

        <h1>
          🗺️ ${title}
        </h1>

        <p>
          Identitas dan informasi blok kebun
        </p>

      </div>

    </div>


    <div class="card">

      <form
        method="POST"
        action="${
          edit
            ? "/blok/edit"
            : "/blok/create"
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


          ${field(
            "Kode Blok",
            "kode_blok",
            data.kode_blok || "",
            "text",
            false,
            true
          )}


          ${field(
            "Nama Blok",
            "nama_blok",
            data.nama_blok || "",
            "text",
            false,
            true
          )}


          ${selectField(
            "Komoditas",
            "komoditas",
            `
              <option value="">
                -- pilih komoditas --
              </option>

              <option
                value="Alpukat"
                ${
                  data.komoditas === "Alpukat"
                    ? "selected"
                    : ""
                }
              >
                Alpukat
              </option>

              <option
                value="Kakao"
                ${
                  data.komoditas === "Kakao"
                    ? "selected"
                    : ""
                }
              >
                Kakao
              </option>

              <option
                value="Pisang"
                ${
                  data.komoditas === "Pisang"
                    ? "selected"
                    : ""
                }
              >
                Pisang
              </option>

              <option
                value="Pepaya"
                ${
                  data.komoditas === "Pepaya"
                    ? "selected"
                    : ""
                }
              >
                Pepaya
              </option>

              <option
                value="Campuran"
                ${
                  data.komoditas === "Campuran"
                    ? "selected"
                    : ""
                }
              >
                Campuran
              </option>
            `,
            data.komoditas || ""
          )}


          ${field(
            "Luas (m)",
            "luas_ha",
            data.luas_ha ?? "",
            "number"
          )}


          ${field(
            "Lokasi",
            "lokasi",
            data.lokasi || ""
          )}


          ${field(
            "Kemiringan (%)",
            "kemiringan_persen",
            data.kemiringan_persen ?? "",
            "number"
          )}


          ${field(
            "Ketinggian (mdpl)",
            "ketinggian_mdpl",
            data.ketinggian_mdpl ?? "",
            "number"
          )}


          ${field(
            "Tahun Mulai",
            "tahun_mulai",
            data.tahun_mulai ?? "",
            "number"
          )}


          ${selectField(
            "Status",
            "status",
            `
              <option
                value="aktif"
                ${
                  (data.status || "aktif") === "aktif"
                    ? "selected"
                    : ""
                }
              >
                Aktif
              </option>

              <option
                value="nonaktif"
                ${
                  data.status === "nonaktif"
                    ? "selected"
                    : ""
                }
              >
                Nonaktif
              </option>
            `,
            data.status || "aktif"
          )}


          ${textareaField(
            "Keterangan",
            "keterangan",
            data.keterangan || "",
            true
          )}

        </div>


        ${formButtons("/blok")}

      </form>

    </div>

  `;

  return layout(
    title,
    content,
    "blok",
    "admin"
  );
}
async function blokCreate(
  request,
  env
){

  const form =
    await request.formData();

  const kode_blok =
    String(
      form.get("kode_blok") || ""
    ).trim();

  const nama_blok =
    String(
      form.get("nama_blok") || ""
    ).trim();

  if(
    !kode_blok ||
    !nama_blok
  ){

    return new Response(
      "Kode Blok dan Nama Blok wajib diisi",
      {
        status: 400
      }
    );

  }

  try{

    await env.DB
      .prepare(`
        INSERT INTO blok (
          kode_blok,
          nama_blok,
          komoditas,
          luas_ha,
          lokasi,
          kemiringan_persen,
          ketinggian_mdpl,
          tahun_mulai,
          status,
          keterangan
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(

        kode_blok,

        nama_blok,

        form.get("komoditas") || null,

        form.get("luas_ha") === ""
          ? null
          : Number(form.get("luas_ha")),

        form.get("lokasi") || null,

        form.get("kemiringan_persen") === ""
          ? null
          : Number(
              form.get("kemiringan_persen")
            ),

        form.get("ketinggian_mdpl") === ""
          ? null
          : Number(
              form.get("ketinggian_mdpl")
            ),

        form.get("tahun_mulai") === ""
          ? null
          : Number(
              form.get("tahun_mulai")
            ),

        form.get("status") || "aktif",

        form.get("keterangan") || null

      )
      .run();

    return Response.redirect(
      new URL(
        "/blok",
        request.url
      ),
      303
    );

  }catch(error){

    return new Response(
      `
        Gagal menyimpan Blok.

        <br><br>

        ${esc(error.message || String(error))}
      `,
      {
        status: 400,
        headers: {
          "content-type":
            "text/html; charset=UTF-8"
        }
      }
    );

  }
}

async function blokEditPage(
  env,
  id
){

  const result =
    await env.DB
      .prepare(`
        SELECT *
        FROM blok
        WHERE id = ?
        LIMIT 1
      `)
      .bind(id)
      .first();

  if(!result){

    return `
      <div class="card">

        <h2>Blok tidak ditemukan</h2>

        <a href="/blok">
          ← Kembali
        </a>

      </div>
    `;

  }

  return blokForm(
    env,
    result,
    true
  );
}

async function blokEdit(
  request,
  env
){

  const form =
    await request.formData();

  const id =
    String(
      form.get("id") || ""
    ).trim();

  const kode_blok =
    String(
      form.get("kode_blok") || ""
    ).trim();

  const nama_blok =
    String(
      form.get("nama_blok") || ""
    ).trim();

  if(
    !id ||
    !kode_blok ||
    !nama_blok
  ){

    return new Response(
      "ID, Kode Blok dan Nama Blok wajib diisi",
      {
        status: 400
      }
    );

  }

  try{

    await env.DB
      .prepare(`
        UPDATE blok

        SET

          kode_blok = ?,
          nama_blok = ?,
          komoditas = ?,
          luas_ha = ?,
          lokasi = ?,
          kemiringan_persen = ?,
          ketinggian_mdpl = ?,
          tahun_mulai = ?,
          status = ?,
          keterangan = ?

        WHERE id = ?
      `)
      .bind(

        kode_blok,

        nama_blok,

        form.get("komoditas") || null,

        form.get("luas_ha") === ""
          ? null
          : Number(
              form.get("luas_ha")
            ),

        form.get("lokasi") || null,

        form.get("kemiringan_persen") === ""
          ? null
          : Number(
              form.get("kemiringan_persen")
            ),

        form.get("ketinggian_mdpl") === ""
          ? null
          : Number(
              form.get("ketinggian_mdpl")
            ),

        form.get("tahun_mulai") === ""
          ? null
          : Number(
              form.get("tahun_mulai")
            ),

        form.get("status") || "aktif",

        form.get("keterangan") || null,

        id

      )
      .run();

    return Response.redirect(
      new URL(
        "/blok",
        request.url
      ),
      303
    );

  }catch(error){

    return new Response(
      `
        Gagal mengubah Blok.

        <br><br>

        ${esc(error.message || String(error))}
      `,
      {
        status: 400,
        headers: {
          "content-type":
            "text/html; charset=UTF-8"
        }
      }
    );

  }
}

async function blokNonaktifkan(
  request,
  env,
  id
){

  if(!id){

    return new Response(
      "ID Blok tidak valid",
      {
        status: 400
      }
    );

  }

  await env.DB
    .prepare(`
      UPDATE blok

      SET status = 'nonaktif'

      WHERE id = ?
    `)
    .bind(id)
    .run();

  return Response.redirect(
    new URL(
      "/blok",
      request.url
    ),
    303
  );
}

async function blokAktifkan(
  request,
  env,
  id
){

  if(!id){

    return new Response(
      "ID Blok tidak valid",
      {
        status: 400
      }
    );

  }

  await env.DB
    .prepare(`
      UPDATE blok

      SET status = 'aktif'

      WHERE id = ?
    `)
    .bind(id)
    .run();

  return Response.redirect(
    new URL(
      "/blok",
      request.url
    ),
    303
  );
}

async function blokList(env){

  const blok = await getBlok(env);

  const rows = blok.map(b => `

    <tr>

      <td>
        <strong>${esc(b.kode_blok)}</strong>
      </td>

      <td>
        ${esc(b.nama_blok)}
      </td>

      <td>
        ${esc(b.komoditas || "-")}
      </td>

      <td>
        ${b.luas_ha ?? "-"}
      </td>

      <td>
        ${esc(b.lokasi || "-")}
      </td>

      <td>
        ${b.ketinggian_mdpl ?? "-"}
      </td>

      <td>
        ${b.kemiringan_persen ?? "-"}
      </td>

      <td>
        ${
          b.status === "aktif"
            ? `<span class="badge badge-success">Aktif</span>`
            : `<span class="badge">Nonaktif</span>`
        }
      </td>

      <td>

        <div class="action-group">

          <a
            class="btn btn-small"
            href="/blok/${encodeURIComponent(b.id)}/edit"
          >
            ✏️ Edit
          </a>

          ${
  b.status === "aktif"
    ? `
      <form
        method="POST"
        action="/blok/${encodeURIComponent(b.id)}/nonaktifkan"
        style="display:inline"
        onsubmit="return confirm('Nonaktifkan blok ini?')"
      >
        <button
          type="submit"
          class="btn btn-small"
        >
          ⛔ Nonaktifkan
        </button>
      </form>
    `
    : `
      <form
        method="POST"
        action="/blok/${encodeURIComponent(b.id)}/aktifkan"
        style="display:inline"
        onsubmit="return confirm('Aktifkan kembali blok ini?')"
      >
        <button
          type="submit"
          class="btn btn-small"
        >
          ✅ Aktifkan
        </button>
      </form>
    `
}

        </div>

      </td>

    </tr>

  `).join("");

  const content = `

    <div class="page-title">

      <div>

        <h1>🗺️ Master Blok</h1>

        <p>
          Pengelolaan blok kebun Avokoka Kingdom
        </p>

      </div>

      <div>

        <a
          href="/blok/new"
          class="btn btn-primary"
        >
          ➕ Tambah Blok
        </a>

      </div>

    </div>


    <div class="card">

      ${
        blok.length === 0
          ? `
            <div class="empty-state">

              <h3>Belum ada Blok</h3>

              <p>
                Tambahkan Blok pertama untuk digunakan
                pada data pohon.
              </p>

              <a
                href="/blok/new"
                class="btn btn-primary"
              >
                ➕ Tambah Blok
              </a>

            </div>
          `
          : `

            <div class="table-wrap">

              <table>

                <thead>

                  <tr>

                    <th>Kode</th>
                    <th>Nama Blok</th>
                    <th>Komoditas</th>
                    <th>Luas (m)</th>
                    <th>Lokasi</th>
                    <th>mdpl</th>
                    <th>Kemiringan</th>
                    <th>Status</th>
                    <th>Aksi</th>

                  </tr>

                </thead>

                <tbody>

                  ${rows}

                </tbody>

              </table>

            </div>

          `
      }

    </div>

  `;

  return layout(
    "Master Blok",
    content,
    "blok",
    "admin"
  );
}

async function getBibit(env){

  try{

    const result =
      await env.DB
        .prepare(`
          SELECT
            id,
            kode_bibit,
            komoditas,
            varietas,
            status
          FROM bibit
          ORDER BY kode_bibit
        `)
        .all();

    return result.results || [];

  }catch{

    return [];

  }
}


// ============================================================
// 16. OPTION HELPERS
// ============================================================

function pohonOptions(
  pohon,
  selected = ""
){

  return `
    <option value="">
      -- pilih pohon --
    </option>

    ${pohon.map(p => `

      <option
        value="${esc(p.id)}"
        ${
          String(p.id) === String(selected)
            ? "selected"
            : ""
        }
      >

        ${esc(p.kode_pohon)}
        -
        ${esc(p.komoditas || "")}
        -
        ${esc(p.varietas || "")}

      </option>

    `).join("")}
  `;
}


function blokLabel(b){

  return (
    b.kode_blok ||
    b.nama_blok ||
    b.kode ||
    b.nama ||
    `Blok ${b.id}`
  );
}


function blokOptions(
  blok,
  selected = ""
){

  return `
    <option value="">
      -- pilih blok --
    </option>

    ${blok.map(b => `

      <option
        value="${esc(b.id)}"
        ${
          String(b.id) === String(selected)
            ? "selected"
            : ""
        }
      >

        ${esc(blokLabel(b))}

      </option>

    `).join("")}
  `;
}


function bibitOptions(
  bibit,
  selected = ""
){

  return `
    <option value="">
      -- pilih bibit --
    </option>

    ${bibit.map(b => `

      <option
        value="${esc(b.id)}"
        ${
          String(b.id) === String(selected)
            ? "selected"
            : ""
        }
      >

        ${esc(b.kode_bibit)}
        -
        ${esc(b.komoditas || "")}
        -
        ${esc(b.varietas || "")}

      </option>

    `).join("")}
  `;
}

// ========================================================


export {
  APP_NAME,
  APP_TITLE,
  CSS,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  USER_SESSION_COOKIE,
  USER_SESSION_MAX_AGE,
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
};
