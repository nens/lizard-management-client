import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import SelectBoxSearch from "../components/SelectBoxSearch";

interface Timeseries {
    uuid: string,
};

interface MyState {
    selectedAsset: {
        title?: string,
        entity_name?: string,
        entity_id?: number | null,
        timeseries?: []
    },
    selectedTimeseriesNestedAsset: {
        code?: string,
        name?: string,
        timeseries?: []
    },
    selectedTimeseries: {},
    foundTimeseriesAssetsSearchEndpoint: [],
    selectedTimeseriesAssetFromSearchEndpoint: {},
    selectedTimeseriesAssetFromAssetEndpoint: any,
};

class TimeseriesSelectionInput extends Component<InjectedIntlProps, MyState> {
    state: MyState = {
        selectedAsset: {},
        selectedTimeseriesNestedAsset: {},
        selectedTimeseries: {},
        foundTimeseriesAssetsSearchEndpoint: [],
        selectedTimeseriesAssetFromSearchEndpoint: {},
        selectedTimeseriesAssetFromAssetEndpoint: {},
    }

    fetchAssetsFromSearchEndpoint = async (assetName: string) => {
        // Fetch assets from Lizard api with search endpoint.
        try {
            // Set page_size to 100000, same as in Raster.js
            const assets = await fetch(
                `/api/v3/search/?q=${assetName}&page_size=100000`,
                {
                    credentials: "same-origin"
                }
            )
                .then(response => response.json())
                .then(data => {
                    return data.results;
                });
            return assets;
        } catch (e) {
            throw new Error(e);
        }
    }
    handleSetTimeseriesAsset = async (assetObj: MyState['selectedAsset']) => {
        this.handleResetTimeseriesAsset();
        this.setState({
            selectedTimeseriesAssetFromSearchEndpoint: assetObj
        });
        // do not fetch asset obj if selected asset is not validated
        if (!this.validateTimeseriesAsset(assetObj)) {
            return;
        }
        try {
            // Set page_size to 100000, same as in Raster.js
            const asset = await fetch(
                `/api/v3/${assetObj.entity_name}s/${assetObj.entity_id}/?page_size=100000`,
                {
                    credentials: "same-origin"
                }
            )
                .then(response => response.json())
                .then(data => {
                    return data;
                });
            this.setState({
                selectedTimeseriesAssetFromAssetEndpoint: asset
            });
        } catch (e) {
            throw new Error(e);
        }
    }
    validateTimeseriesAsset = (obj: MyState['selectedAsset']) => {
        return obj.title && obj.entity_id && obj.entity_name;
    }
    handleResetTimeseriesAsset = () => {
        this.setState({
            foundTimeseriesAssetsSearchEndpoint: [],
            selectedTimeseriesAssetFromSearchEndpoint: {},
            selectedTimeseriesAssetFromAssetEndpoint: {}
        });
        this.handleResetTimeseriesNestedAsset();
        this.handleResetTimeseries();
    }
    handleSetTimeseriesNestedAsset = async (nestedAssetObj: MyState['selectedTimeseriesNestedAsset']) => {
        this.setState({
            selectedTimeseriesNestedAsset: nestedAssetObj
        });
    }
    handleSetTimeseries = async (timeseriesObj: MyState['selectedTimeseries']) => {
        this.setState({
            selectedTimeseries: timeseriesObj
        });
    }
    validateTimeseriesNestedAsset = (obj: MyState['selectedTimeseriesNestedAsset']) => {
        return obj.code || obj.name;
    }
    handleResetTimeseriesNestedAsset = () => {
        this.setState({
            selectedTimeseriesNestedAsset: {}
        });
        this.handleResetTimeseries();
    }
    getAllTimeseriesFromTimeseriesAsset = (assetObj: MyState['selectedAsset'], nestedAssetObj: MyState['selectedTimeseriesNestedAsset']) => {
        // Show timeseries of nested asset if a nested asset is selected.
        if (nestedAssetObj && nestedAssetObj.timeseries) {
            return nestedAssetObj.timeseries;
            // Show timeseries of only the asset and not also the nested assets if
            // an asset but no nested asset is selected.
        } else if (assetObj && assetObj.timeseries) {
            return assetObj.timeseries;
        } else {
            return [];
        }
    }
    validateTimeseries = (obj: Timeseries) => {
        return obj && obj.uuid && obj.uuid.length > 0;
    }
    handleResetTimeseries = () => {
        this.setState({
            selectedTimeseries: {}
        });
    }

    render() {
        const {

        } = this.state;

        //Format message for placeholder in the input form for translation
        const placeholderTimeseriesSelectionViaAsset = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection_via_asset" });
        const placeholderTimeseriesSelectionViaNestedAsset = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection_via_nested_asset" });
        const placeholderTimeseriesSelection = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection" });

        return (
            <div>
                <SelectBoxSearch
                    choices={
                        this.state.foundTimeseriesAssetsSearchEndpoint
                    }
                    choice={
                        this.state.selectedTimeseriesAssetFromSearchEndpoint
                    }
                    transformChoiceToDisplayValue={(e: any) =>
                        (e && e.title) || ""}
                    isFetching={false}
                    updateModelValue={this.handleSetTimeseriesAsset}
                    onKeyUp={(e: any) => {
                        this.fetchAssetsFromSearchEndpoint(
                            e.target.value
                        ).then(data => {
                            this.setState({
                                foundTimeseriesAssetsSearchEndpoint: data
                            });
                        });
                    }}
                    inputId={
                        "notifications_app.select_timeserie_via_asset" +
                        "_input"
                    }
                    placeholder={placeholderTimeseriesSelectionViaAsset}
                    validate={this.validateTimeseriesAsset}
                    resetModelValue={
                        this.handleResetTimeseriesAsset
                    }
                    readonly={false}
                    noneValue={undefined}
                />{" "}
                <br />
                <SelectBoxSearch
                    choices={
                        this.state.selectedTimeseriesAssetFromAssetEndpoint.pumps ||
                        this.state.selectedTimeseriesAssetFromAssetEndpoint.filters ||
                        []
                    }
                    choice={this.state.selectedTimeseriesNestedAsset}
                    transformChoiceToDisplayValue={(e: any) =>
                        (e && e.code) || (e && e.name) || ""}
                    isFetching={false}
                    updateModelValue={this.handleSetTimeseriesNestedAsset}
                    onKeyUp={(e: any) => { }}
                    inputId={
                        "notifications_app.select_timeserie_via_nested_asset" +
                        "_input"
                    }
                    placeholder={placeholderTimeseriesSelectionViaNestedAsset}
                    validate={this.validateTimeseriesNestedAsset}
                    resetModelValue={this.handleResetTimeseriesNestedAsset}
                    readonly={false}
                    noneValue={undefined}
                />{" "}
                <br />
                <SelectBoxSearch
                    choices={this.getAllTimeseriesFromTimeseriesAsset(
                        this.state.selectedTimeseriesAssetFromAssetEndpoint,
                        this.state.selectedTimeseriesNestedAsset
                    )}
                    choice={this.state.selectedTimeseries}
                    transformChoiceToDisplayValue={(e: any) => {
                        if (e) {
                            if (e.name && e.uuid) {
                                return `name: ${e.name} - uuid: ${e.uuid}`;
                            } else if (e.name) {
                                return `name: ${e.name}`;
                            } else if (e.uuid) {
                                return `uuid: ${e.uuid}`;
                            } else {
                                return "";
                            }
                        } else {
                            return "";
                        }
                    }}
                    isFetching={false}
                    updateModelValue={(e: any) => {
                        if (typeof e === "string") {
                            // e is a string typed in by user
                            this.handleSetTimeseries({ uuid: e });
                        } else {
                            // e is a timeseries object coming from a selected option from the API
                            this.handleSetTimeseries(e);
                        }
                    }}
                    onKeyUp={(e: any) => { }}
                    inputId={
                        "notifications_app.select_timeserie" +
                        "_input"
                    }
                    placeholder={placeholderTimeseriesSelection}
                    validate={this.validateTimeseries}
                    resetModelValue={this.handleResetTimeseries}
                    readonly={false}
                    noneValue={undefined}
                />{" "}
            </div>
        )
    }
}

export default injectIntl(TimeseriesSelectionInput);