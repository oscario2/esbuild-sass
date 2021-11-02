import path from "path";
import { exec } from "child_process";
import { tmpdir } from "os";
import { createHash } from "crypto";
import { cwd } from "process";
import { promises as fs } from "fs";

export default {
    name: 'sass',
    setup: (build) => {
        const uuid = createHash('md5').update(cwd()).digest("hex")
        const tmpDir = tmpdir + path.sep + uuid;

        build.onResolve({ filter: /.\.(scss|sass)$/, namespace: "file" }, async (args) => {
            const srcPath = path.resolve(args.resolveDir, args.path);
            const srcDir = path.dirname(srcPath);
            const srcFile = path.basename(srcPath);
            const srcExt = path.extname(srcPath);

            const dstDir = srcDir.replace(cwd(), tmpDir);
            const _ = await fs.mkdir(dstDir, { recursive: true }); // ignore EEXIST

            let dstPath = dstDir + path.sep + srcFile;
            dstPath = dstPath.replace(srcExt, ".css");

            await new Promise(async (resolve) => {
                const cmd = await exec(`sass ${srcPath}:${dstPath}`, { stdio: 'inherit' });
                cmd.stderr.on('data', (data) => {
                    if (data) throw (data)
                });
                cmd.on('close', resolve);
            });

            return { path: dstPath, watchFiles: [srcPath] }
        });

        build.onEnd(async (result) => {
            if (result.errors.length || result.warnings.length) {
                throw new (result);
            }
        });
    },
}