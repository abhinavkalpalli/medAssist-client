import { join, resolve } from "path";
import { DefinePlugin } from 'webpack';
const dotenv = require('dotenv').config( {
  path: join(__dirname, '.env')
} );

export const entry = "./src/app.js";
export const output = {
    path: resolve(__dirname, "public"),
    filename: "app.js",
};
export const module = {
    rules: [
        {
            test: /\.js?$/,
            exclude: /(node_modules)/,
            include: resolve(__dirname, "src"),
            use: {
                loader: "babel-loader"
            }
        },
    ]
};
export const plugins = [
    new DefinePlugin({
        "process.env": dotenv.parsed
    }),
];