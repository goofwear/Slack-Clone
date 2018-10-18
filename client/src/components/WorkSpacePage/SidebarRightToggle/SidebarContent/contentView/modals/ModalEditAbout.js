import { connect } from "react-redux";

import { teamSelector } from "@/reducers/";
import { teamAction } from "@/actions";
import { HOCModal, HOCForm } from "@/components/common";
import ModalEditAbout from "./ModalEditAbout.jsx";

const stateToProps = state => ({
  currentTeam: teamSelector.getCurrentTeam(state)
});

const dispatchToProps = dispatch => ({
  fetchEditTeam: editTeamData => {
    dispatch(teamAction.fetchEditTeam(editTeamData));
  }
});

const formDataToProps = () => ({
  formFields: { about: "" },
  fieldsToValidate: ["about"]
});

export default connect(
  stateToProps,
  dispatchToProps
)(HOCModal(HOCForm(formDataToProps)(ModalEditAbout)));
