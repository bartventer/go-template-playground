import {
	type NumberInputProps,
	NumberInputField as ChakraNumberInputField,
	FormControl,
	FormHelperText,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputStepper,
} from "@chakra-ui/react";
import { memo } from "react";
import type { FieldProps } from "./types";

export type NumberInputFieldProps = FieldProps & NumberInputProps;

export const NumberInputField: React.FC<NumberInputFieldProps> = memo(
	({ name, label, helperText, value, onChange, ...props }) => (
		<FormControl as="fieldset">
			<FormLabel
				as="legend"
				fontSize={{ base: "md", sm: "sm" }}
				fontWeight="bold"
			>
				{label}
			</FormLabel>
			<FormHelperText
				mt={0}
				mb={1}
			>
				{helperText}
			</FormHelperText>
			<NumberInput
				name={name}
				value={value}
				onChange={onChange}
				size="sm"
				{...props}
			>
				<ChakraNumberInputField />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
		</FormControl>
	),
);
