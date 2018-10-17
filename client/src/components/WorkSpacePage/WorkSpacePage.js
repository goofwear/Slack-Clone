import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";

import { sessionStore } from "@/utils";
import { teamAction, globalStateAction } from "@/actions";
import {
  userSelector,
  channelSelector,
  teamSelector,
  globalStateSelector
} from "@/reducers/";
import WorkSpacePage from "./WorkSpacePage.jsx";

const WorkSpacePageHOC = WrappedComponent => {
  class WorkSpacePageContainer extends React.Component {
    UNSAFE_componentWillMount() {
      const {
        fetchTeamAssociatedList,
        receiveSocketNewTeamMember
      } = this.props;
      receiveSocketNewTeamMember();
      // get channelList, messageGroupList, teamMemberList when component mount
      if (this.isCurrentTeamExist()) {
        const teamId = sessionStore.getTeamId();
        fetchTeamAssociatedList(teamId);
      }
    }

    componentWillUnmount() {
      const { clearSocketConnection } = this.props;
      clearSocketConnection();
    }

    isCurrentTeamExist = () => {
      if (sessionStore.getTeamId() === "0") return false;
      return true;
    };

    render() {
      const {
        isSidebarOpen,
        userIsLoading,
        channelIsLoading,
        teamIsLoading
      } = this.props;
      return (
        <LoadingOverlay
          active={userIsLoading || channelIsLoading || teamIsLoading}
          spinner
          zIndex={10}
          text="Loading"
        >
          <React.Fragment>
            {/* redirect to create team if user is not in any team */}
            {this.isCurrentTeamExist ? (
              <WrappedComponent isSidebarOpen={isSidebarOpen} />
            ) : (
              <Redirect to="/create-team" />
            )}
          </React.Fragment>
        </LoadingOverlay>
      );
    }
  }
  WorkSpacePageContainer.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    userIsLoading: PropTypes.bool.isRequired,
    channelIsLoading: PropTypes.bool.isRequired,
    teamIsLoading: PropTypes.bool.isRequired,

    clearSocketConnection: PropTypes.func.isRequired,
    fetchTeamAssociatedList: PropTypes.func.isRequired,
    receiveSocketNewTeamMember: PropTypes.func.isRequired
  };
  return WorkSpacePageContainer;
};

const stateToProps = state => ({
  currentTeam: teamSelector.getCurrentTeam(state),
  isSidebarOpen: globalStateSelector.getIsSidebarOpen(state),
  userIsLoading: userSelector.getUserIsLoading(state),
  channelIsLoading: channelSelector.getChannelIsLoading(state),
  teamIsLoading: teamSelector.getTeamIsLoading(state)
});

const dispatchToProps = dispatch => ({
  fetchTeamAssociatedList: teamId => {
    dispatch(teamAction.fetchTeamAssociatedList(teamId));
  },
  clearSocketConnection: () => {
    dispatch(globalStateAction.clearSocketConnection());
  },
  receiveSocketNewTeamMember: () => {
    dispatch(teamAction.receiveSocketNewTeamMember());
  }
});

export default connect(
  stateToProps,
  dispatchToProps
)(WorkSpacePageHOC(WorkSpacePage));