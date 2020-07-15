import { cancelGameCreation } from './server-page.js'
export { changeToGameActivity }

var currentActivity = document.getElementById("info-page");
const builder = document.getElementById("builder-page");
const stats = document.getElementById("stats-page");
const game = document.getElementById("game-page");
const server = document.getElementById("server-page");
const settings = document.getElementById("settings-page");
const info = document.getElementById("info-page");

document.getElementById("builderIcon").addEventListener("click", changeToBuilderActivity);
document.getElementById("statsIcon").addEventListener("click", changeToStatsActivity);
document.getElementById("gameIcon").addEventListener("click", changeToGameActivity);
document.getElementById("serverIcon").addEventListener("click", changeToServerActivity);
document.getElementById("settingsIcon").addEventListener("click", changeToSettingsActivity);
document.getElementById("infoIcon").addEventListener("click", changeToInfoActivity);

document.getElementById("builderIcon").addEventListener("click", cancelGameCreation);
document.getElementById("statsIcon").addEventListener("click", cancelGameCreation);
document.getElementById("gameIcon").addEventListener("click", cancelGameCreation);
document.getElementById("serverIcon").addEventListener("click", cancelGameCreation);
document.getElementById("settingsIcon").addEventListener("click", cancelGameCreation);
document.getElementById("infoIcon").addEventListener("click", cancelGameCreation);

function changeToBuilderActivity(d) {
    currentActivity.style.display = "none";
    builder.style.display = "flex";
    currentActivity = builder;
}

function changeToStatsActivity(d) {
    currentActivity.style.display = "none";
    stats.style.display = "flex";
    currentActivity = stats;
}

function changeToGameActivity(d) {
    currentActivity.style.display = "none";
    game.style.display = "flex";
    currentActivity = game;
}

function changeToServerActivity(d) {
    currentActivity.style.display = "none";
    server.style.display = "flex";
    currentActivity = server;
}

function changeToSettingsActivity(d) {
    currentActivity.style.display = "none";
    settings.style.display = "flex";
    currentActivity = settings;
}

function changeToInfoActivity(d) {
    currentActivity.style.display = "none";
    info.style.display = "flex";
    currentActivity = info;
}