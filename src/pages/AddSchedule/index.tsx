import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, FormHelperText, Typography, Stack, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import Profile from "@/components/Profile";
import Schedule from "@/components/Schedule";
import validationSchema, { IAddBarber } from "./validationSchema";
import { defaultValues } from "./defaults";
import { IQueueAvailable } from "@/components/Schedule/util";

const AddSchedule = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const [queueAvailable, setQueueAvailable] = useState<
    Record<string, IQueueAvailable>
  >({});

  const onSubmit = (data: IAddBarber) => {
    console.log(data, "data is here!");
  };

  return (
    <Card
      elevation={0}
      sx={{
        padding: 2,
        margin: 2,
        border: "1px solid #f0f0f0",
        boxShadow: "1px 1px 1px 1px #f0f0f0",
      }}
    >
      <Stack direction="column" marginBottom={4}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          React Working Hours
        </Typography>
        <FormHelperText sx={{ textAlign: "center" }}>
          This is an example of a complex form with validations using yup,
          react-hook-form and dayjs.
        </FormHelperText>
      </Stack>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
          <Profile />
          <Schedule
            defaultValues={defaultValues}
            queueAvailable={queueAvailable}
            setQueueAvailable={setQueueAvailable}
            onSubmit={onSubmit}
          />

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
};

export default AddSchedule;
