import {
	Checkbox,
	FormControl,
	FormHelperText,
	FormLabel,
} from "@chakra-ui/react";
import { memo } from "react";
import { FieldProps } from "./types";

export interface CheckboxFieldProps extends FieldProps {
	checked?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = memo(
	({ name, label, helperText, checked, onChange, isDisabled }) => (
		<FormControl as="fieldset">
			<FormLabel
				as="legend"
				fontSize={{ base: "md", sm: "sm" }}
				fontWeight="bold"
			>
				{label}
			</FormLabel>
			<Checkbox
				name={name}
				value="true"
				isChecked={checked}
				onChange={onChange}
				isDisabled={isDisabled}
			>
				<FormHelperText mt={0}>{helperText}</FormHelperText>
			</Checkbox>
		</FormControl>
	),
);
