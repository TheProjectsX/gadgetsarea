"use client";

import { setAuthModalType } from "@/store/features/config/configSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AuthButtonWrapper = ({
    children,
}: {
    children: React.ReactElement<any, any>;
}) => {
    const { data: userInfo } = useSelector((state: any) => state.user_info);

    const handleOnClick = (
        ogOnClick: (...args: unknown[]) => unknown,
        ...args: unknown[]
    ) => {
        if (!userInfo) {
            return toast.error("Please Login First!");
        }

        ogOnClick(...args);
    };

    const clonedButton = React.cloneElement(children, {
        tabIndex: 0,
        onClick: (...args: unknown[]) =>
            handleOnClick(children.props.onClick, ...args),
    });

    return clonedButton;
};

export default AuthButtonWrapper;
