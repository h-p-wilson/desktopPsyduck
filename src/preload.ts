import { contextBridge } from "electron";
import path from "path";

// Expose the asset path to the renderer process
contextBridge.exposeInMainWorld("assetPath", (file: string) => {
	// In production, assets are in the dist folder
	return `file://${path.join(__dirname, "assets", file)}`;
});