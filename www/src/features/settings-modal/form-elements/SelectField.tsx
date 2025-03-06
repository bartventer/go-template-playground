import {
	FormControl,
	FormHelperText,
	FormLabel,
	Select,
} from "@chakra-ui/react";
import { memo } from "react";
import { FieldProps } from "./types";

export interface SelectFieldProps extends FieldProps {
	children: React.ReactNode;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = memo(
	({ name, value, label, helperText, onChange, children }) => (
		<FormControl>
			<FormLabel
				fontSize={{ base: "md", sm: "sm" }}
				fontWeight="bold"
			>
				{label}
			</FormLabel>
			<FormHelperText mt={0}>{helperText}</FormHelperText>
			<Select
				name={name}
				value={value}
				size={{ base: "md", sm: "sm" }}
				mt={1.5}
				onChange={onChange}
				isDisabled={!onChange}
			>
				{children}
			</Select>
		</FormControl>
	),
);
