import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from "react-redux";
import type { AppDispatch, RootState } from "../store/index";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
