import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import {
  useFieldArray,
  Controller,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { allDays, getDayNameByIndex, getQueueOptions } from "@/utils";
import { cn } from "@/lib/cn";
import { IAddBarber, IDay } from "@/pages/AddSchedule/validationSchema";
import { IQueueAvailable } from "./util";

const totalBarbers = 4;
const queueOptions = getQueueOptions(totalBarbers);

interface IProps {
  defaultValues: IAddBarber;
  queueAvailable: Record<string, IQueueAvailable>;
  setQueueAvailable: React.Dispatch<
    React.SetStateAction<Record<string, IQueueAvailable>>
  >;
  onSubmit: (data: IAddBarber) => void;
  loading?: boolean;
}

const Schedule = ({
  defaultValues,
  queueAvailable,
  setQueueAvailable,
}: IProps) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors: formErrors },
    getValues,
    trigger,
  } = useFormContext();
  const allowSchedule = watch("allowSchedule");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = formErrors as any;

  const { fields } = useFieldArray({
    control,
    name: "days",
  });

  const days: IDay[] = useWatch({
    control,
    name: "days",
    defaultValue: defaultValues.days,
  });

  const activeScheduleDays: IDay[] = useMemo(
    () => days.filter((day) => day.active),
    [days]
  );

  const activeBreakDays = useMemo(
    () => days.filter((day) => day.breakActive),
    [days]
  );

  const validateForm = useCallback(async () => {
    // re-trigger validation
    await trigger();
  }, [trigger]);

  const setApplyScheduleToAllDays = useCallback(
    (apply: boolean) => {
      const {
        allDays: { startTime, endTime },
      } = getValues();
      if (apply) {
        fields.forEach((_, index) => {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.startTime`, startTime);
          setValue(`days.${index}.endTime`, endTime);
        });
      } else {
        fields.forEach((_, index) => {
          setValue(`days.${index}.active`, false);
        });
      }
    },
    [fields, setValue, getValues]
  );

  // this method is for start time and end time for all days
  const setApplyScheduleToSelectedDays = useCallback(
    ({
      startTime,
      endTime,
    }: {
      startTime: string | undefined;
      endTime: string | undefined;
    }) => {
      days.forEach((day, index) => {
        if (day.active) {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.startTime`, startTime);
          setValue(`days.${index}.endTime`, endTime);
        }
      });
    },
    [days, setValue]
  );

  // this method is for break time for selected days
  const setApplyBreakTimeToSelectedDays = useCallback(
    ({
      breakStartTime,
      breakEndTime,
    }: {
      breakStartTime: string | undefined;
      breakEndTime: string | undefined;
    }) => {
      days.forEach((day, index) => {
        if (day.active) {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.breakStartTime`, breakStartTime);
          setValue(`days.${index}.breakEndTime`, breakEndTime);
        }
      });
    },
    [days, setValue]
  );

  // mark the apply on all days if all visible days are active
  const applyBreakTimeToAllDays = useMemo(
    () => activeBreakDays.length === days.map((day) => day.breakActive).length,
    [days, activeBreakDays]
  );
  const setApplyBreakTimeToAllDays = useCallback(
    (apply: boolean) => {
      const {
        allDays: { breakStartTime, breakEndTime },
      } = getValues();
      if (apply) {
        fields.forEach((_, index) => {
          setValue(`days.${index}.breakDayIndex`, index);
          setValue(`days.${index}.breakActive`, true);
          setValue(`days.${index}.breakStartTime`, breakStartTime);
          setValue(`days.${index}.breakEndTime`, breakEndTime);
        });
      } else {
        fields.forEach((_, index) => {
          setValue(`days.${index}.breakActive`, false);
          setValue(`days.${index}.breakDayIndex`, -1);
        });
      }
    },
    [fields, setValue, getValues]
  );

  return (
    <div className="changeLayout !w-full !bg-[--white-text] table-box-shadow border-box !rounded-[6px] !mt-4">
      <div>
        <FormControl>
          <FormLabel className="!text-[black]">
            Do you want to add the Schedule of Barber?
          </FormLabel>
          <Controller
            name="allowSchedule"
            control={control}
            render={({ field }) => {
              return (
                <RadioGroup
                  row
                  value={field.value ? "yes" : "no"}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(e.target.value === "yes");
                    if (value === "yes") {
                      setApplyScheduleToAllDays(true);
                    }
                  }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              );
            }}
          />
        </FormControl>
      </div>

      {allowSchedule && (
        <>
          {/* Shop Opening and Closing Time */}
          <Box className="flex justify-between !w-full !mb-4 !mt-4 !ml-0">
            <FormControlLabel
              label={
                <Typography
                  sx={{
                    marginRight: 4,
                  }}
                >
                  Shop Opening Time
                </Typography>
              }
              sx={{
                ml: 0,
              }}
              labelPlacement="start"
              className="!w-full"
              control={
                <Controller
                  control={control}
                  name="shopOpeningTime"
                  render={({ field }) => (
                    <TimePicker
                      className="!mx-0 flex !flex-1"
                      sx={{
                        ".MuiInputBase-root": {
                          height: "40px",
                        },
                      }}
                      disabled
                      label="Shop Opening Time"
                      value={dayjs(field.value)}
                      onChange={(value) => {
                        field.onChange(value?.toISOString());
                      }}
                    />
                  )}
                />
              }
            />
            <FormControlLabel
              sx={{
                ml: 0,
                mr: 0,
              }}
              label={
                <Typography
                  sx={{
                    marginLeft: 4,
                    marginRight: 4,
                  }}
                >
                  Shop Closing Time
                </Typography>
              }
              labelPlacement="start"
              className="!w-full"
              control={
                <Controller
                  control={control}
                  name="shopClosingTime"
                  render={({ field }) => (
                    <TimePicker
                      sx={{
                        ".MuiInputBase-root": {
                          height: "40px",
                        },
                      }}
                      className="!mx-0 flex !flex-1"
                      disabled
                      label="Shop Closing Time"
                      value={dayjs(field.value)}
                      onChange={(value) => {
                        field.onChange(value?.toISOString());
                      }}
                    />
                  )}
                />
              }
            />
          </Box>
          <div className="mb-5 flex items-center gap-x-4 !w-full justify-between border-[1px] border-solid border-[--border-file] !rounded-lg !px-3 !py-4 !pl-5">
            {/* All Days */}
            <Typography
              sx={{
                width: 200,
              }}
            >
              All Days
            </Typography>
            <Box className="flex gap-2">
              <FormControlLabel
                label={<Typography sx={{ mr: 2 }}>Start Time</Typography>}
                labelPlacement="start"
                control={
                  <Controller
                    control={control}
                    name="allDays.startTime"
                    render={({ field }) => {
                      return (
                        <TimePicker
                          sx={{
                            ".MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          className="ml-4"
                          label="Start Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            field.onChange(value?.toISOString());
                            // setRefreshScheduleTime((p) => p + 1);
                            // setApplyScheduleToAllDays(true, { startTime, endTime });
                            setApplyScheduleToSelectedDays({
                              startTime: value?.toISOString(),
                              endTime: getValues("allDays.endTime"),
                            });
                            setTimeout(() => {
                              validateForm();
                            }, 0);
                          }}
                        />
                      );
                    }}
                  />
                }
              />
              <FormControlLabel
                label={<Typography sx={{ mr: 2 }}>End Time</Typography>}
                labelPlacement="start"
                control={
                  <Controller
                    control={control}
                    name="allDays.endTime"
                    render={({ field }) => (
                      <TimePicker
                        sx={{
                          ".MuiInputBase-root": {
                            height: "40px",
                          },
                        }}
                        className="ml-4"
                        label="End Time"
                        value={dayjs(field.value)}
                        onChange={(value) => {
                          const endTime = value?.toISOString();
                          field.onChange(endTime);
                          // setRefreshScheduleTime((p) => p + 1);
                          // setApplyScheduleToAllDays(applyScheduleToAllDays);
                          setApplyScheduleToSelectedDays({
                            startTime: getValues("allDays.startTime"),
                            endTime,
                          });
                          setTimeout(() => {
                            validateForm();
                          }, 0);
                        }}
                      />
                    )}
                  />
                }
              />
            </Box>

            <FormControlLabel
              // disabled={true}
              sx={{ cursor: "not-allowed" }}
              control={
                <Checkbox
                  sx={{
                    cursor: "not-allowed",
                  }}
                  checked
                  // checked={applyScheduleToAllDays}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // setApplyScheduleToAllDays(e.target.checked);
                  }}
                />
              }
              // For the schedule
              label={<span className="text-gray-400">Apply on all days</span>}
              className="ml-4"
            />
          </div>

          <div className="border-[1px] border-solid border-[--border-file] !rounded-lg !px-3 !py-5 !w-full mt-4">
            {fields.map((day, index) => (
              <div key={day.id} className="!mb-5">
                <div className="flex gap-x-4 justify-between !pl-5">
                  <FormControlLabel
                    className="days-label"
                    sx={{ width: 200 }}
                    control={
                      <Controller
                        control={control}
                        name={`days.${index}.active`}
                        render={({ field }) => {
                          return (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                field.onChange(isChecked);
                                setValue(`days.${index}.active`, isChecked);
                                // set the queue number to 0 if the day is not active
                                if (!isChecked) {
                                  setValue(`days.${index}.queueNumber`, 0);
                                }
                                // clear error message as well
                                setQueueAvailable((prev) => {
                                  prev[index] = {
                                    index: -1,
                                    status: "",
                                    loading: false,
                                  };
                                  return prev;
                                });
                              }}
                            />
                          );
                        }}
                      />
                    }
                    label={getDayNameByIndex(index)}
                  />
                  <Box className="flex gap-3" sx={{ minWidth: 480 }}>
                    <Controller
                      control={control}
                      name={`days.${index}.startTime`}
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            ".MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          className="flex-1"
                          label="Start Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            field.onChange(value?.toISOString());
                            validateForm();
                          }}
                          // renderInput={(params) => (
                          //   <TextField
                          //     {...params}
                          //     error={!!errors.days?.[index]?.startTime}
                          //     helperText={
                          //       errors.days?.[index]?.startTime?.message
                          //     }
                          //   />
                          // )}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`days.${index}.endTime`}
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            ".MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          label="End Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            field.onChange(value?.toISOString());
                            validateForm();
                          }}
                          className="flex-1"
                          // renderInput={(params) => (
                          //   <TextField
                          //     {...params}
                          //     error={!!errors.days?.[index]?.endTime}
                          //     helperText={
                          //       errors.days?.[index]?.endTime?.message
                          //     }
                          //   />
                          // )}
                        />
                      )}
                    />
                  </Box>

                  {/* Queue Number */}
                  <Controller
                    control={control}
                    name={`days.${index}.queueNumber`}
                    defaultValue=""
                    disabled={!days[index].active}
                    render={({ field }) => (
                      <FormControl
                        className="w-[100px]"
                        error={
                          queueAvailable[index] &&
                          !queueAvailable[index].loading &&
                          queueAvailable[index].status === "error"
                        }
                      >
                        {!field.value && (
                          <InputLabel
                            style={{
                              marginLeft: "0",
                              marginTop: "18px",
                              zIndex: 2,
                              backgroundColor: "white",
                              position: "absolute",
                              fontSize: "1.25rem",
                              color: "#000000",
                              fontWeight: 500,
                            }}
                          >
                            0
                          </InputLabel>
                        )}
                        <InputLabel
                          style={{
                            marginLeft: "1px",
                            marginTop: "1px",
                            zIndex: 2,
                            backgroundColor: "white",
                            position: "absolute",
                            fontSize: "1rem",
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: 500,
                          }}
                        >
                          Queue
                        </InputLabel>
                        <Select
                          variant="outlined"
                          label="Queue"
                          {...field}
                          defaultValue=""
                          value={field.value}
                          onChange={(event) => {
                            setQueueAvailable((prev) => ({
                              ...prev,
                              [index]: {
                                index: -1,
                                status: "",
                                loading: true,
                              },
                            }));
                            // dispatch(checkQueueAvailability({ payload }))
                            //   .unwrap()
                            //   .then((res) => {
                            //     setQueueAvailable((prev) => ({
                            //       ...prev,
                            //       [index]: {
                            //         ...prev[index],
                            //         index,
                            //         status: "success",
                            //         loading: false,
                            //       },
                            //     }));
                            //   })
                            //   .catch((err) => {
                            //     setQueueAvailable((prev) => ({
                            //       ...prev,
                            //       [index]: {
                            //         ...prev[index],
                            //         index,
                            //         status: "error",
                            //         loading: false,
                            //       },
                            //     }));
                            //   });
                            field.onChange(event.target.value);
                          }}
                          className="w-full h-[38px] border rounded-md queue-select"
                        >
                          {queueOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {queueAvailable[index] &&
                        !queueAvailable[index].loading &&
                        queueAvailable[index].status !== "" ? (
                          <FormHelperText
                            sx={{
                              color: (theme) =>
                                queueAvailable[index].status === "success"
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                            }}
                          >
                            {queueAvailable[index].status === "success"
                              ? "Queue Available"
                              : "Queue not available"}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </div>

                {/* Break time per row */}
                {/* <div>
                  <div className="ml-20 mb-4">
                    <FormControlLabel
                      control={
                        <Controller
                          control={control}
                          name={`days.${index}.breakActive`}
                          render={({ field }) => {
                            return (
                              <Checkbox
                                {...field}
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                }}
                              />
                            );
                          }}
                        />
                      }
                      label="Add break time?"
                      labelPlacement="start"
                    />
                  </div>
                  {days[index].breakActive && (
                    <div className="ml-24 mb-4">
                      <Controller
                        control={control}
                        name={`days.${index}.breakStartTime`}
                        render={({ field }) => (
                          <TimePicker
                            label="Break Start Time"
                            value={dayjs(field.value)}
                            onChange={(value) =>
                              field.onChange(value.toISOString())
                            }
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                error: !!errors.days?.[index]?.breakStartTime,
                                helperText:
                                  errors.days?.[index]?.breakStartTime?.message,
                              },
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`days.${index}.breakEndTime`}
                        render={({ field }) => (
                          <TimePicker
                            label="Break End Time"
                            value={dayjs(field.value)}
                            onChange={(value) =>
                              field.onChange(value.toISOString())
                            }
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                error: !!errors.days?.[index]?.breakEndTime,
                                helperText:
                                  errors.days?.[index]?.breakEndTime?.message,
                              },
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        )}
                      />
                    </div>
                  )}
                </div> */}
              </div>
            ))}
          </div>

          <div className="my-5 flex items-center gap-x-4 !w-full justify-between border-[1px] border-solid border-[--border-file] !rounded-lg !px-3 !py-4 !pl-5">
            <Typography sx={{ width: 200 }}>Break Time</Typography>

            <Box className="flex gap-2">
              <FormControlLabel
                label={<Typography sx={{ mr: 2 }}>Start Time</Typography>}
                labelPlacement="start"
                control={
                  <Controller
                    control={control}
                    name="allDays.breakStartTime"
                    render={({ field }) => (
                      <TimePicker
                        sx={{
                          ".MuiInputBase-root": {
                            height: "40px",
                          },
                        }}
                        className="ml-4"
                        label="Start Time"
                        value={dayjs(field.value)}
                        onChange={(value) => {
                          const breakStartTime = value?.toISOString();
                          field.onChange(breakStartTime);
                          // setRefreshBreakTime((p) => p + 1);
                          // setApplyBreakTimeToAllDays(applyBreakTimeToAllDays);
                          setApplyBreakTimeToSelectedDays({
                            breakStartTime,
                            breakEndTime: getValues("allDays.breakEndTime"),
                          });
                          setTimeout(() => {
                            validateForm();
                          }, 0);
                        }}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     error={!!errors.allDays?.startTime}
                        //     helperText={errors.allDays?.startTime?.message}
                        //   />
                        // )}
                      />
                    )}
                  />
                }
              />
              <FormControlLabel
                label={<Typography sx={{ mr: 2 }}>End Time</Typography>}
                labelPlacement="start"
                control={
                  <Controller
                    control={control}
                    name="allDays.breakEndTime"
                    render={({ field }) => (
                      <TimePicker
                        sx={{
                          ".MuiInputBase-root": {
                            height: "40px",
                          },
                        }}
                        className="ml-4"
                        label="End Time"
                        value={dayjs(field.value)}
                        onChange={(value) => {
                          const breakEndTime = value?.toISOString();
                          field.onChange(value?.toISOString());
                          // setRefreshBreakTime((p) => p + 1);
                          // setApplyBreakTimeToAllDays(applyBreakTimeToAllDays);
                          setApplyBreakTimeToSelectedDays({
                            breakStartTime: getValues("allDays.breakStartTime"),
                            breakEndTime,
                          });
                          setTimeout(() => {
                            validateForm();
                          }, 0);
                        }}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     error={!!errors.allDays?.endTime}
                        //     helperText={errors.allDays?.endTime?.message}
                        //   />
                        // )}
                      />
                    )}
                  />
                }
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={applyBreakTimeToAllDays}
                  onChange={(e) => {
                    setApplyBreakTimeToAllDays(e.target.checked);
                    setTimeout(() => {
                      validateForm();
                    }, 0);
                  }}
                />
              }
              // For the break time
              label="Apply on all days"
              className={cn("ml-4", {
                "opacity-0": activeScheduleDays.length === 0,
              })}
            />
          </div>

          {activeScheduleDays.length > 0 && (
            <div className="mb-5 flex gap-x-4 !w-full justify-between border-[1px] border-solid border-[--border-file] !rounded-lg !px-3 !py-4 !pl-5 flex-col">
              {/* Show all the days in the schedule that are active (checked) */}
              <div className="flex flex-wrap items-center !w-full !mb-4">
                {allDays.map((_, index) => {
                  if (!days[index].active) return null;
                  return (
                    <div key={`break_time__${index}`}>
                      <Controller
                        control={control}
                        name={`days.${index}.breakActive`}
                        render={({ field }) => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    if (e.target.checked) {
                                      setValue(
                                        `days.${index}.breakDayIndex`,
                                        index
                                      );
                                    } else {
                                      setValue(
                                        `days.${index}.breakDayIndex`,
                                        -1
                                      );
                                    }
                                    validateForm();
                                  }}
                                />
                              }
                              label={getDayNameByIndex(index)}
                              className="ml-4"
                            />
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {(applyBreakTimeToAllDays || activeScheduleDays.length > 0) && (
                <div>
                  {activeScheduleDays.map((day, index) => {
                    const dayIndex = day.breakDayIndex;
                    if (
                      day.breakDayIndex === -1 &&
                      // (!days[index].active || !day.breakActive)
                      (!day.active || !day.breakActive)
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={`active_break_time__${index}`}
                        className="flex items-center space-x-4 space-y-2 !mb-3 !w-full"
                      >
                        <Typography className="!w-[70px]">
                          {getDayNameByIndex(day.breakDayIndex)}
                        </Typography>

                        <Box className="flex gap-2 !ml-36">
                          <FormControlLabel
                            label={
                              <Typography sx={{ mr: 2 }}>Start Time</Typography>
                            }
                            labelPlacement="start"
                            control={
                              <Controller
                                control={control}
                                // name={`days.${day.breakDayIndex}.breakStartTime`}
                                // name={`days.${index}.breakStartTime`}
                                name={`days.${dayIndex}.breakStartTime`}
                                render={({ field }) => (
                                  <TimePicker
                                    sx={{
                                      ".MuiInputBase-root": {
                                        height: "40px",
                                      },
                                    }}
                                    className="ml-4"
                                    label="Start Time"
                                    value={dayjs(field.value)}
                                    onChange={(value) => {
                                      field.onChange(value?.toISOString());
                                    }}
                                    slotProps={{
                                      textField: {
                                        variant: "outlined",
                                        error:
                                          // !!errors.days?.[day.breakDayIndex]
                                          //   ?.breakStartTime?.message,
                                          // !!errors.days?.[index]
                                          //   ?.breakStartTime?.message,
                                          !!errors.days?.[dayIndex]
                                            ?.breakStartTime?.message,
                                        helperText:
                                          // errors.days?.[day.breakDayIndex]
                                          //   ?.breakStartTime?.message,
                                          // errors.days?.[index]?.breakStartTime
                                          //   ?.message,
                                          errors.days?.[dayIndex]
                                            ?.breakStartTime?.message,
                                      },
                                    }}
                                    // renderInput={(params) => (
                                    //   <TextField {...params} />
                                    // )}
                                  />
                                )}
                              />
                            }
                          />
                          <FormControlLabel
                            label={
                              <Typography sx={{ mr: 2 }}>End Time</Typography>
                            }
                            labelPlacement="start"
                            control={
                              <Controller
                                control={control}
                                // name={`days.${day.breakDayIndex}.breakEndTime`}
                                // name={`days.${index}.breakEndTime`}
                                name={`days.${dayIndex}.breakEndTime`}
                                render={({ field }) => (
                                  <TimePicker
                                    sx={{
                                      ".MuiInputBase-root": {
                                        height: "40px",
                                      },
                                    }}
                                    className="ml-4"
                                    label="End Time"
                                    value={dayjs(field.value)}
                                    onChange={(value) =>
                                      field.onChange(value?.toISOString())
                                    }
                                    slotProps={{
                                      textField: {
                                        variant: "outlined",
                                        error:
                                          // !!errors.days?.[day.breakDayIndex]
                                          //   ?.breakEndTime?.message,
                                          // !!errors.days?.[index]?.breakEndTime
                                          //   ?.message,
                                          !!errors.days?.[dayIndex]
                                            ?.breakEndTime?.message,
                                        helperText:
                                          // errors.days?.[day.breakDayIndex]
                                          //   ?.breakEndTime?.message,
                                          // errors.days?.[index]?.breakEndTime
                                          //   ?.message,
                                          errors.days?.[dayIndex]?.breakEndTime
                                            ?.message,
                                      },
                                    }}
                                    // renderInput={(params) => (
                                    //   <TextField {...params} />
                                    // )}
                                  />
                                )}
                              />
                            }
                          />
                        </Box>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;
