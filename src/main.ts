import { app, BrowserWindow } from "electron";
// This lets us work with file paths
import path from "path";

// this is the window instance
let mainWindow: BrowserWindow;

function createWindow() {
	// This creates the transparent, always on top window
	mainWindow = new BrowserWindow({
		width: 400,
		height: 400,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	mainWindow.loadFile(path.join(__dirname, "index.html")); // This loads an HTML file

	// Only open dev tools in development mode
	if (process.env.NODE_ENV === "development") {
		mainWindow.webContents.openDevTools();
	}

	// Handle window closed
	mainWindow.on("closed", () => {
		mainWindow = null as any;
	});

	// Add keyboard shortcut to close the app (Cmd+Q on macOS, Ctrl+Q on others)
	mainWindow.webContents.on("before-input-event", (event, input) => {
		if (input.control && input.key.toLowerCase() === "q") {
			app.quit();
		}
		if (
			process.platform === "darwin" &&
			input.meta &&
			input.key.toLowerCase() === "q"
		) {
			app.quit();
		}
		// ESC key to quit
		if (input.key === "Escape") {
			app.quit();
		}
	});
}

app.on("ready", createWindow); // This listens for when initialisation is finished and opens the window

app.on("window-all-closed", () => {
	// Quit the app when all windows are closed, regardless of platform
	app.quit();
});

app.on("activate", () => {
	// On macOS, re-create window if it was closed but app is still active
	if (mainWindow === null) {
		createWindow();
	}
});
