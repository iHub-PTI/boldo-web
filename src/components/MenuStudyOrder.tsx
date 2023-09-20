import React from 'react';
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, ORGANIZATION_BAR, WIDTH_XL } from "../util/constants";
import useWindowDimensions from "../util/useWindowDimensions";
import StudyOrder from "./studiesorder/StudyOrder";

export type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization } & { token: string }

type Props = {
  appointment: AppointmentWithPatient,
  isFromInperson: boolean,
}

export const  MenuStudyOrder: React.FC<Props> = (props) => {
  
  //width windows
  const { width } = useWindowDimensions()

    return (
      <>
          <div id="study_orders" className="flex flex-col flex-no-wrap flex-1 w-full" style={{
            height: ` ${width >= WIDTH_XL
                ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
                : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
              }`,
            overflowY: "auto"
          }}>
            <StudyOrder appointment={props.appointment} />
          </div>
      </>

    )


}