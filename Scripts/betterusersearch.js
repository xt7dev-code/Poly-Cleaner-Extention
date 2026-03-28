console.log("Better User Search loaded!");


const advancedfiltersHTML = `
<div class="card mcard mb-4">
    <h6 class="card-header">
        <i class="fad fa-filter"></i> Filter
    </h6>
    <div class="card-body pt-2 pb-0 mb-4">
        <form id="filters-form" class="row g-3 align-items-end">
            <div class="col-12 col-md-4 col-lg-4">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1">Search</label>
                <div class="input-group">
                    <span class="input-group-text bg-dark border-end-0"><i class="fas fa-search text-muted"></i></span>
                    <input type="text" class="form-control bg-dark border-start-0 ps-0" id="search-query" placeholder="Search users">
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1">Limit</label>
                <div class="input-group">
                    <input type="number" class="form-control bg-dark border-start-0 ps-2" id="filter-query" placeholder="10">
                </div>
            </div><div class="col-6 col-md-4 col-lg-2">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1">Sort By</label>
                <select class="form-select bg-dark" id="filter-sort">
                    <option value="registeredAt" selected="">Newest First</option>
                    <option value="username">Username</option>
                    <option value="id">UserId</option>
                    <option value="lastSeenAt">Last Seen</option>
                </select>
            </div>
            <div class="col-6 col-md-4 col-lg-2">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1">Order</label>
                <select class="form-select bg-dark" id="filter-direction">
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <button class="btn btn-secondary" type="submit">Submit</button>
        </form>
    </div>
</div>`;

const advancedfilterbuttonHTML = `
<div class="col"><button class="me-4 btn btn-sm btn-outline-secondary" onclick="openadvancedfilters()">
	<i class="fad fa-filter me-1"></i>
	<span>Enter Advanced Search</span>
</button></div>`
document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div > div > div.row.small.my-1").insertAdjacentHTML("afterbegin", advancedfilterbuttonHTML);

const displaytoggleHTML = `
<h6 class="card-header">
    <i class="fad fa-user-magnifying-glass"></i> Find people
    <ul class="nav nav-tabs card-header-tabs mt-2" id="users-tabs" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link " id="grid-tab">
                <i class="fad fa-grid me-1"></i>
                Grid
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link active" id="list-tab">
                <i class="fad fa-list me-1"></i>
                List
            </a>
        </li>
    </ul>
</h6>`;


function createusercard(userdata) {
    const userId = userdata.id;
    const username = userdata.username;
    const avatarUrl = userdata.thumbnail.avatar;
    const description = userdata.description || "";

    // 1. Main Container
    const row = document.createElement('div');
    row.className = 'row mb-1 bg-body rounded-3 py-2 user-entry';
    row.dataset.userId = userId;
    row.id = `user-${userId}`;

    // --- Column 1: Avatar ---
    const colAvatar = document.createElement('div');
    colAvatar.className = 'col-auto px-2';

    const avatarLink = document.createElement('a');
    avatarLink.href = `/users/${userId}`;

    const avatarImg = document.createElement('img');
    avatarImg.src = avatarUrl;
    avatarImg.className = 'img-fluid rounded-circle';
    avatarImg.alt = username + "'s avatar";
    avatarImg.width = 64;

    avatarLink.appendChild(avatarImg);
    colAvatar.appendChild(avatarLink);

    // --- Column 2: User Info ---
    const colInfo = document.createElement('div');
    colInfo.className = 'col text-truncate';

    // Username Link
    const userLink = document.createElement('a');
    userLink.href = `/users/${userId}`;
    userLink.className = 'text-reset text-decoration-none';

    userLink.appendChild(document.createTextNode(' ' + username + ' '));

    // Level/Stats Row
    const statsRow = document.createElement('div');
    statsRow.className = 'small text-muted w-100 d-flex justify-content-start gap-3';

    const accCreatedSpan = document.createElement('span');
    accCreatedSpan.className = 'fw-bold text-muted';
    const clockIcon = document.createElement('i');
    clockIcon.className = 'fas fa-clock me-1';
    accCreatedSpan.appendChild(clockIcon);

    var fromiso = new Date(userdata.registeredAt)
    var datestring = fromiso.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' , hour: '2-digit', minute: '2-digit' });
    accCreatedSpan.appendChild(clockIcon);
    accCreatedSpan.appendChild(document.createTextNode(datestring));

    const useridSpan = document.createElement('span');
    useridSpan.className = 'fw-bold text-muted';
    const hashtagIcon = document.createElement('i');
    hashtagIcon.className = 'fas fa-hashtag me-1';
    useridSpan.appendChild(hashtagIcon);
    useridSpan.appendChild(document.createTextNode(userId));


    // Spacer div
    const spacer = document.createElement('div');
    spacer.className = 'small text-muted w-100';
    spacer.innerHTML = description;
    spacer.style.textWrap = "auto";

    statsRow.appendChild(accCreatedSpan);
    statsRow.appendChild(useridSpan);
    colInfo.append(userLink, spacer, statsRow);

    // --- Column 3: Actions ---
    const colActions = document.createElement('div');
    colActions.className = 'col-auto d-flex align-items-center';

    // Report Button
    const reportBtn = document.createElement('button');
    reportBtn.className = 'me-2 btn btn-sm btn-outline-danger';
    reportBtn.dataset.reportbuttonid = userId;
    reportBtn.onclick = () => openReportPopup(userId);

    const flagIcon = document.createElement('i');
    flagIcon.className = 'fad fa-flag me-1';
    const btnText = document.createElement('span');
    btnText.textContent = 'Report';

    reportBtn.append(flagIcon, btnText);
    colActions.append(reportBtn);

    // Report Button
    const profileBtn = document.createElement('button');
    profileBtn.className = 'me-2 btn btn-sm btn-outline-primary';
    profileBtn.dataset.profilebuttonid = userId;
    profileBtn.onclick = () => openProfilePopup(userId);

    const profileIcon = document.createElement('i');
    profileIcon.className = 'fad fa-user me-1';
    const pbtnText = document.createElement('span');
    pbtnText.textContent = 'Profile';

    profileBtn.append(profileIcon, pbtnText);
    colActions.append(profileBtn);

    // --- Assembly ---
    row.append(colAvatar, colInfo, colActions);
    return row;
}

function openiframeModal(url, onLoadCallback) {
    const container = document.createElement('div');
    container.className = 'swal2-backdrop-show swal2-center swal2-container';
    container.dataset.swal2Theme = 'dark';
    container.style.overflowY = 'auto';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.zIndex = '1000';
    container.id = 'iframe-modal-container';

    const modal = document.createElement('div');
    modal.className = 'rounded-3 swal2-modal swal2-popup swal2-show';
    modal.style.display = 'grid';
    modal.style.width = '75%';
    modal.style.height = '150%';
    modal.style.gridTemplateRows = '60px auto';

    const header = document.createElement('div');
    header.className = 'mb-5';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'm-3 me-4 btn btn-danger';

    const icon = document.createElement('i');
    icon.className = 'fa fa-close me-1';
    const btnText = document.createElement('span');
    btnText.textContent = 'Close';

    closeBtn.append(icon, btnText);
    header.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
        container.remove();
    });

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.id = 'popup-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.onload = function() {
        if (onLoadCallback) {
            onLoadCallback(iframe);
        }

        try {
            iframe.contentWindow.document.querySelector("#main-content > nav.navbar.navbar-expand-lg.navbar-light.bg-navbar.nav-topbar").remove();
            iframe.contentWindow.document.querySelector("#main-content > nav.navbar.nav-secondary-plusdx.navbar-expand-lg.navbar-light.bg-navbar.nav-secondary.d-lg-flex.d-none").remove();
            iframe.contentWindow.document.querySelector("#main-content > div:nth-child(2) > div.text-center.mt-4.px-1").remove();
            iframe.contentWindow.document.querySelector("#main-content > div.container-fluid").remove();
            iframe.contentWindow.document.querySelector("#main-content > div:nth-child(2) > div.mobile-nav-bottom.d-lg-none").remove();
        } catch (e) {
            console.warn("could not remove elements from the iframe (page must be cloudflare or baggy messed something up):", e);
        }
    };

    modal.append(header, iframe);
    container.appendChild(modal);
    document.body.appendChild(container);
}

function openReportPopup (userId) {
    // Implementation for opening report popup
    var onloadCallback = function(iframe) {
        if (iframe.contentWindow.location.href == "https://polytoria.com/home") {
            document.getElementById("iframe-modal-container").remove();
        }
    };
    openiframeModal(`https://polytoria.com/report/user/${userId}`, onloadCallback);
};

function openProfilePopup(userId) {
    openiframeModal(`https://polytoria.com/users/${userId}`);
}


function openadvancedfilters() {
    document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div > div > div.row.mb-1").remove();
    const userholder = document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div > div > div:nth-child(2) > div");
    userholder.innerHTML = "";
    userholder.style.display = "grid";
    document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div.col-12.col-lg-8 > div").insertAdjacentHTML("beforebegin", advancedfiltersHTML);

    document.getElementById("filters-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("search-query").value.trim();
        const limit = parseInt(document.getElementById("filter-query").value) || 10;
        const sort = document.getElementById("filter-sort").value;
        const direction = document.getElementById("filter-direction").value;
        searchusers(query, limit, sort, direction).then(data => {
            userholder.innerHTML = "";
            data.users.forEach(user => {
                const userCard = createusercard(user);
                userholder.appendChild(userCard);
            }
            );
            const loadMoreBtn = document.createElement("button");
            loadMoreBtn.className = "btn btn-secondary mt-3";
            loadMoreBtn.textContent = "Load More";
            loadMoreBtn.onclick = () => {
                loadMoreBtn.remove();
                addnextpage(2, query, limit, sort, direction);
            };
            userholder.appendChild(loadMoreBtn);
        }).catch(err => {
            console.error("Search error:", err);
        });
    });

    document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div:nth-child(2) > div > div.row.small.my-1 > div:nth-child(1) > button").remove();
    document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div:nth-child(2) > div > div.d-flex.justify-content-center.mt-3").remove();
}

async function addnextpage(page, query, limit, sort, direction) {
    const userholder = document.querySelector("#main-content > div:nth-child(4) > div.py-3.py-lg-5 > div > div > div > div > div:nth-child(2) > div");
    const data = await searchusers(query, limit, sort, direction, page);
    data.users.forEach(user => {
        const userCard = createusercard(user);
        userholder.appendChild(userCard);
    });
    if (data.users.length === limit) {
        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.className = "btn btn-secondary mt-3";
        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.onclick = () => {
            loadMoreBtn.remove();
            addnextpage(page + 1, query, limit, sort, direction);
        };
        userholder.appendChild(loadMoreBtn);
    }
}

async function searchusers(query, limit = 10, sort = "username", direction = "asc", pg = 1) {
    var apiUrl = "https://api.polytoria.com/v1/users?search=" + encodeURIComponent(query) + "&page=" + pg + "&limit=" + limit + "&sort=" + sort + "&order=" + direction;
    var r = await fetch(apiUrl, { credentials: "include" });
    if (r.status !== 200) throw new Error("API request failed with status " + r.status);
    var data = await r.json();
    console.log("API response:", data);
    return data;
}