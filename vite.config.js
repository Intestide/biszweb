import {defineConfig} from "vite";
import fs from "fs";
import path from "path";
export default defineConfig({
    plugins: [
        {
            name: "directory-listing",
            configureServer(server){
                server.middlewares.use("/images.json", (req, res, next)=>{
                    try{
                        let url=new URL(req.url, "http://localhost");
                        let requestedPath=url.pathname.replace("/images.json/", "");
                        let fullPath=path.join(process.cwd(), "public", requestedPath);
                        if (!fs.existsSync(fullPath)||!fs.statSync(fullPath).isDirectory()){
                            res.statusCode=404;
                            res.end(JSON.stringify({ error: "Folder not found" }));
                            return;
                        }
                        let files=fs.readdirSync(fullPath).filter(file=>/\.(jpe?g|png|webp)$/i.test(file));
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(files));
                    }
                    catch (err){
                        console.error("Error listing images:", err);
                        res.statusCode=500;
                        res.end(JSON.stringify({ error: "Server error" }));
                    }
                });
            }
        }
    ],
    server:{
        port: 5173,
        host: true
    },
    build:{
        outDir: "dist",
        assetsDir: "assets"
    }
});