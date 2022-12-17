const lstItem = document.querySelectorAll('.horizontalMenu-list > li');
const items = document.querySelectorAll('.list-item');
const usernames = document.getElementById('username');
const usernamesm = document.getElementById('username-sm');
const memberdates = document.getElementById('memberdate');

const btnSignout = document.getElementById('btnSignout');
const selectVenue = document.getElementById('lstVenue');

const frmVenueSelect = document.getElementById('frmVenueSelect');
const frmUserLogout = document.getElementById('frmUserLogout');

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        InitializeAuthData(),
    ]);
    RenderNavigationMenu();
    
    MultiModalFix();
});

const layoutState = {
    client: null,
    clientAreasNavs: [],
    events: {
        LoadedClientAreasNavs: [],
    },
};

async function InitializeAuthData() {
    const [
        userFunctionLinkList,
        userGroupFunctionLinkList,
        venueList,
        userVenueLinkList,
        navList,
    ] = JSON.parse(base64Decode(sessionState.clientAreasLayoutData));
    
    //#region Route Permission Validation

    if (!sessionState.userGroupAccessAllFunctions && !sessionState.userGroupAccessAllFunctions) {
        const pathName = window.location.pathname.replace(/\/$/g, "");
        
        const accessiblePageUrlList = [
            "/Client",
            ...userFunctionLinkList.map(o => o.Function.PageUrl),
            ...userGroupFunctionLinkList.map(o => o.Function.PageUrl),
        ];

        if (
            !sessionState.userAccessAllFunctions &&
            !sessionState.userGroupAccessAllFunctions &&
            accessiblePageUrlList.filter(o => new RegExp(`^${o}$`).test(pathName)).length === 0
        ) {
            window.location.href = "/Client";
        }
    }

    //#endregion

    //#region Set Venue List

    const userVenueIdLinkList = userVenueLinkList.map(o => o.VenueID);
    const linkedVenues = [];
    venueList.forEach(venue => {
        if (sessionState.userAccessAllFunctions ||
            sessionState.userGroupAccessAllFunctions ||
            userVenueIdLinkList.includes(venue.VenueID))
        {
            linkedVenues.push(venue);
        }
    });

    $("#lstVenue").html("");
    linkedVenues.forEach(venue => {
        $("#lstVenue").append(`
                <option value="${venue.VenueID}">${venue.VenueName}</option>
            `);
    });
    $("#lstVenue").val(sessionState.venueId);

    //#endregion

    //#region Set Client Logo
    const imageData = sessionState.imageData;

    $("#logo").attr("src",`data:image/jpeg;base64,${imageData}`);
    $("#logo_small").attr("src",`data:image/jpeg;base64,${imageData}`);

    //#endregion

    //#region Set Navigation Menu
    
    layoutState.clientAreasNavs = navList;
    await publishEvent(layoutState.events.LoadedClientAreasNavs);
    
    //#endregion
}

function HideMenu(val) {
    for (let i = 0; i < val.length; i++) {
        document.getElementById(val[i]).classList.remove('disable');
        const name = document.getElementById(val[i]).closest('.horizontalMenu-list > li').getAttribute('name');
        const item = document.querySelector("li[name='" + name + "']");
        item.classList.remove('disable');
    }
}

function RenderNavigationMenu() {
    const nav1List = layoutState.clientAreasNavs;

    const nav1ListElement = $("#navlist");
    for (const nav1Item of nav1List) {
        const isNav1Parent = nav1Item.Children != null && nav1Item.Children.length > 0;

        const nav1ItemElement = $(`
            <li aria-haspopup="true" name="${nav1Item.Name}">
                <a href="${nav1Item.Url}" class="sub-icon">
                    <i class="${nav1Item.IconClass}"></i> ${nav1Item.Label} ${isNav1Parent ? `<i class="fa fa-angle-down horizontal-icon"></i>` : ""}
                </a>
                ${isNav1Parent ? `
                    <ul class="sub-menu">
                    </ul>
                ` : ""}
            </li>
        `);

        if (isNav1Parent) {
            const nav1SubMenuElement = nav1ItemElement.children(".sub-menu").eq(0);
            for (const nav2Item of nav1Item.Children) {
                const isNav2Parent = nav2Item.Children != null && nav2Item.Children.length > 0;

                const nav2ItemElement = $(`
                    <li aria-haspopup="true" class="list-item ${isNav2Parent ? "sub-menu-sub" : ""}">
                        <a href="${nav2Item.Url}">
                            <i class="${nav2Item.IconClass}" style="margin-right: 0.5rem !important;"></i> ${nav2Item.Label}
                        </a>
                        ${isNav2Parent ? `
                            <ul class="sub-menu">
                            </ul>
                        ` : ""}
                    </li>
                `);

                if (isNav2Parent) {
                    const nav2SubMenuElement = nav2ItemElement.children(".sub-menu").eq(0);
                    for (const nav3Item of nav2Item.Children) {
                        const nav3ItemElement = $(`
                            <li aria-haspopup="true">
                                <a href="${nav3Item.Url}">
                                    <i class="${nav3Item.IconClass}"></i>${nav3Item.Label}
                                </a>
                            </li>
                        `);

                        nav2SubMenuElement.append(nav3ItemElement);
                    }
                }

                nav1SubMenuElement.append(nav2ItemElement);
            }
        }

        nav1ListElement.append(nav1ItemElement);
    }

    LoadHorizontalMenu();
}

function MultiModalFix() {
    /// Multiple Modal Scroll fix (https://stackoverflow.com/a/32712953)
    $('.modal').on("hidden.bs.modal", function (e) { //fire on closing modal box
        if ($('.modal:visible').length) { // check whether parent modal is opend after child modal close
            $('body').addClass('modal-open'); // if open mean length is 1 then add a bootstrap css class to body of the page
        }
    });
    //this code segment will activate parent modal dialog 
    //after child modal box close then scroll problem will automatically fixed
}

btnSignout.addEventListener('click', function () {
    $(frmUserLogout).submit();
});

selectVenue.addEventListener('change', async function () {
    $(frmVenueSelect).submit();
});