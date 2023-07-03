"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectUnix = exports.connectOIDC = void 0;
const tslib_1 = require("tslib");
const openid_client_1 = require("openid-client");
const axios_1 = tslib_1.__importDefault(require("axios"));
const https_1 = require("https");
function connectOIDC(url, accessToken, refreshToken) {
    const reqClient = axios_1.default.create({
        httpsAgent: new https_1.Agent({
            rejectUnauthorized: false
        })
    });
    reqClient.interceptors.request.use((request) => {
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.headers["X-LXD-oidc"] = "true";
        request.baseURL = url + "/1.0";
        return request;
    });
    reqClient.interceptors.response.use((response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return response;
    }), (error) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log(error);
        if (error.response.data) {
            if (error.response.data["error"]) {
                if (error.response.data["error"] == "invalid token") {
                    if (refreshToken) {
                        const oidcIssuer = yield openid_client_1.Issuer.discover(error.response.data.metadata["issuer"]);
                        const oidcClient = new oidcIssuer.Client({
                            client_id: error.response.data.metadata["client_id"],
                            token_endpoint_auth_method: "none"
                        });
                        let newSet = yield oidcClient.refresh(refreshToken);
                        if (newSet.access_token && newSet.refresh_token) {
                            accessToken = newSet.access_token;
                            refreshToken = newSet.refresh_token;
                            return yield reqClient(error.config);
                        }
                        else {
                            return error;
                        }
                    }
                }
            }
        }
        let err = error;
        throw new Error((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.metadata);
    }));
    return reqClient;
}
exports.connectOIDC = connectOIDC;
function connectUnix(socketPath) {
    const reqClient = axios_1.default.create({
        httpsAgent: new https_1.Agent({
            rejectUnauthorized: false,
        }),
        socketPath: socketPath,
    });
    reqClient.interceptors.request.use((request) => {
        request.baseURL = socketPath + "/1.0";
        return request;
    });
    return reqClient;
}
exports.connectUnix = connectUnix;
