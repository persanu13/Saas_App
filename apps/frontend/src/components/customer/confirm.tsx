"use client";

import { Service } from "@/api/services";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type Props = { comment: string; setComment: Dispatch<SetStateAction<string>> };

export function Confirm({ comment, setComment }: Props) {
  return (
    <div className="flex flex-col w-full gap-8">
      <h1 className="text-4xl font-black ">Review and confirm</h1>
      <div>
        <h1 className="font-bold text-base">More details</h1>
        <Card className="px-2 py-6 mt-4">
          <CardContent>
            <CardTitle className="text-base font-bold">
              Cancellation policy
            </CardTitle>
            <p className="text-sm font-medium mt-1">
              Please cancel at least 2 hours before appointment
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h1 className="font-bold text-base">Comments or requests</h1>
        <Card className="px-2 py-6 mt-4">
          <CardContent>
            <CardTitle className="text-base font-medium ">
              Anything you'd like us to know?
            </CardTitle>
            <Field className="mt-4">
              <FieldLabel htmlFor="textarea-message">
                Add a booking note{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </FieldLabel>
              <Textarea
                className="h-30 resize-none p-4 text-base font-medium"
                id="textarea-message"
                placeholder="Include comments or requests about your booking"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
