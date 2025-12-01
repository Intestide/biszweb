let clubsCache=null;
let folderMapCache=null;
export async function listClubs(jsonPath="/src/assets/clubs.json"){
    if (clubsCache){
        return clubsCache;
    }
    try{
        let response=await fetch(jsonPath);
        if (!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }
        let clubs=await response.json();
        if (!folderMapCache){
            let allImages=import.meta.glob("/src/assets/img/**/*.{png,jpg,jpeg,gif,webp}",{eager: true, import: "default"});
            folderMapCache={};
            for (let path in allImages){
                let match=path.match(/\/img\/([^/]+)\/([^/]+)\//);
                if (!match){
                    continue;
                }
                let folder=`${match[1]}/${match[2]}/`;
                if (!folderMapCache[folder]) folderMapCache[folder]=[];
                folderMapCache[folder].push({
                    filename: path.split("/").pop(),
                    url: allImages[path]
                });
            }
        }
        let results=clubs.map(club=>{
            let [partOne, partTwo]=club.clubID.split(".");
            let folder=`${partOne}/${partTwo}/`;
            return{...club, folder, images: folderMapCache[folder]||[]};
        });
        clubsCache=results;
        return results;
    }
    catch (err){
        console.error("Error loading clubs.json:", err);
        return [];
    }
}
export function clearClubsCache(){
    clubsCache=null;
    folderMapCache=null;
}