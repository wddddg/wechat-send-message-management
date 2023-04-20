import { RegisterComponents } from "@/api/interface/index";
import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 注册组件
 */
// * 获取已经注册的组件
export const getRegisterComponents = () => {
	return http.get<RegisterComponents>(PORT3 + `/getRegisterComponents`, {}, { headers: { noLoading: true } });
};

/**
 * @name 获取页面信息
 */
// * 获取已经注册的组件
export const getPageInfoById = (id: String) => {
	return http.get(PORT3 + `/getPageInfoById`, { id }, { headers: { noLoading: true } });
};
