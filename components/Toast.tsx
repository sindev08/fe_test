import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (message: string) =>
	toast(<p style={{ fontSize: 14 }}>{message}</p>, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		type: "success",
		theme: "light",
	});

export const notifyError = (message: string) =>
	toast(<p style={{ fontSize: 14 }}>{message}</p>, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		type: "error",
		theme: "light",
	});

export const notifyInfo = (message: string) =>
	toast(<p style={{ fontSize: 14 }}>{message}</p>, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		type: "info",
		theme: "light",
	});

export const notifyWarning = (message: string) =>
	toast(<p style={{ fontSize: 14 }}>{message}</p>, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		type: "warning",
		theme: "light",
	});

const contextClass = {
	success: "bg-white",
	error: "bg-white",
	info: "bg-white",
	warning: "bg-white",
	default: "bg-white",
	dark: "bg-white-600 font-gray-300",
};

export const CustomToastContainer = () => {
	return (
		<ToastContainer
			toastClassName={({ type }) =>
				contextClass[type || "default"] +
				" relative flex px-4 pt-6 pb-8 md:pt-3 md:pb-5 shadow-md min-h-10 rounded-md justify-between mb-4 overflow-hidden cursor-pointer"
			}
			bodyClassName={() =>
				"text-base font-medium flex flex-row items-center text-gray-900"
			}
		/>
	);
};
