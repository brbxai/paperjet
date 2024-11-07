import Decimal from "decimal.js";
import React, { useEffect, useState } from "react"
import { parseInputDecimal } from "@/lib/utils";
import { Input } from "./ui/input";

export const DecimalInput: React.FC<{
  value?: Decimal | null,
  onChangeText?: (v: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onChangeDecimal?: (v: Decimal | null) => void,
  placeholder?: string,
  alignLeft?: boolean,
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}> = (props) => {

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [strVal, setStrVal] = useState("");

  useEffect(() => {
    if (!isBeingEdited)
      setStrVal(props.value === null || props.value === undefined ? "" : props.value.toFixed());
  }, [props.value])

  return <Input value={strVal} style={{ textAlign: props.alignLeft ? 'left' : 'right' }} placeholder={props.placeholder}
    onChange={e => {
      const v = e.target.value;
      setStrVal(v);
      if (props.onChangeText)
        props.onChangeText(v);
      if (props.onChangeDecimal) {
        props.onChangeDecimal(v === "" ? null : parseInputDecimal(v));
      }
    }}
    onFocus={() => {
      setIsBeingEdited(true);
      if (props.onFocus) {
        props.onFocus();
      }
    }}
    onBlur={() => {
      setIsBeingEdited(false);
      setStrVal(strVal === "" ? "" : parseInputDecimal(strVal).toFixed());
      if (props.onBlur) {
        props.onBlur();
      }
    }}
    onKeyUp={props.onKeyUp}
  />
}