import moment from "moment";
import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import CLBorder from "../../../components/CLBorder";
import CLHeader from "../../../components/CLHeader";
import CLSubHeadText from "../../../components/CLSubHeadText";
import { EN } from "../../../languages/manageLanguage";
import * as Constants from "../../../network/Constants";
import { httpRequest } from "../../../network/NetworkCalls";
import { setRacialOriginList } from "../../../redux/actions";
import CLColors from "../../../res/CLColors";
import CLCommonStyles from "../../../res/CLCommonStyles";
import CLImages from "../../../res/CLImages";
import CLStrings from "../../../res/CLStrings";
import CLStyles from "../../../res/CLStyles";
import { storageGet } from "../../../utils/AsyncStorageUtil";
import { dateToStringFormat } from "../../../utils/Util";
import GenralRadings from "./GenralRadings";
import LifestyleComplete from "./LifestyleComplete";
import MedicalBackground from "./MedicalBackground";
import Profile from "./Profile";
import styles from "./styles";
const SectionTypes = {
  PERSONAL: "PERSONAL",
  RACIAL: "RACIAL",
  MEDICAL: "MEDICAL",
  GENRAL: "GENRAL",
  LIFESTYLE: "LIFESTYLE",
};
class MyProfile extends Component {
  static navigationOptions = { headerShown: false, footer: null };
  constructor(props) {
    super(props);
  }
  state = {
    currentDefaultList: [
      {
        id: 1,
        title: this.props.language?.Smoke_cigarettes,
        type: EN()?.Smoke_cigarettes,
        value: false,
      },
      {
        id: 2,
        title: this.props.language?.Chew_tobacco,
        type: EN()?.Chew_tobacco,
        value: false,
      },
      {
        id: 3,
        title: this.props.language?.Use_smokeless_tobacco_products,
        type: EN()?.Use_smokeless_tobacco_products,
        value: false,
      },
    ],
    currentList: [
      {
        id: 1,
        title: this.props.language?.Smoke_cigarettes,
        type: EN()?.Smoke_cigarettes,
        value: false,
      },
      {
        id: 2,
        title: this.props.language?.Chew_tobacco,
        type: EN()?.Chew_tobacco,
        value: false,
      },
      {
        id: 3,
        title: this.props.language?.Use_smokeless_tobacco_products,
        type: EN()?.Use_smokeless_tobacco_products,
        value: false,
      },
    ],
    pastDefaultList: [
      {
        id: 1,
        title: this.props.language?.Smoke_cigarettes_in_past,
        type: EN()?.Smoke_cigarettes_in_past,
        value: false,
      },
      {
        id: 2,
        title: this.props.language?.Chew_tobacco_in_past,
        type: EN()?.Chew_tobacco_in_past,
        value: false,
      },
      {
        id: 3,
        title: this.props.language?.Use_smokeless_tobacco_products_in_past,
        type: EN()?.Use_smokeless_tobacco_products_in_past,
        value: false,
      },
    ],
    pastList: [
      {
        id: 1,
        title: this.props.language?.Smoke_cigarettes_in_past,
        type: EN()?.Smoke_cigarettes_in_past,
        value: false,
      },
      {
        id: 2,
        title: this.props.language?.Chew_tobacco_in_past,
        type: EN()?.Chew_tobacco_in_past,
        value: false,
      },
      {
        id: 3,
        title: this.props.language?.Use_smokeless_tobacco_products_in_past,
        type: EN()?.Use_smokeless_tobacco_products_in_past,
        value: false,
      },
    ],
    homeAddress: this.props.navigation.state?.params?.HomeAddress,
    userDetails: this.props.navigation.state?.params?.userDetails,
    switchLb: false,
    switchIn: false,
    heightPreference: null,
    lifeStyleData: null,
    medicalData: null,

    isProfileComplete: false,
    isRacialOriginComplete: false,
    isMedicalBackgroundCompete: false,
    isGenralReadingsComplete: false,
    isLifeStyleComplete: false,
    totalSections: 5,
    completedSections: 0,
  };

  componentDidMount = () => {
    this.componentDidFocus();
    this.subs = [
      this.props.navigation.addListener("didFocus", this.componentDidFocus),
      this.props.navigation.addListener("willBlur", this.componentWillBlur),
    ];
  };
  componentDidFocus = () => {
    this.getWeightPreference();
    this.getRacialOriginList();
    this.getOnSetSysmptoms();
    this.getHeightPreference();
    this.getLifeStyleDetail();
    this.getMedicalHistoryDetails();
    this.setCompletedSections();
  };

  componentWillBlur = () => {};
  setCompletedSections = () => {
    let completedSections = 0;
    if (this.state.isProfileComplete) {
      completedSections += 1;
    }
    if (this.state.isRacialOriginComplete) {
      completedSections += 1;
    }
    if (this.state.isMedicalBackgroundCompete) {
      completedSections += 1;
    }
    if (this.state.isGenralReadingsComplete) {
      completedSections += 1;
    }
    if (this.state.isLifeStyleComplete) {
      completedSections += 1;
    }
    this.setState({ completedSections });
  };
  getMedicalHistoryDetails = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    const epochData = moment(this.props.graphDate).unix();
    const reqBody = {
      userId: userId,
    };
    httpRequest.post(Constants.USER_MEDICAL_HISTORY, reqBody, (promise) => {
      promise.then(
        (medicalData) => {
          console.log("medicalData", medicalData);
          this.setState({ medicalData });
        },
        (err) => {
          //console.log("error promise", err); // Error: "It broke"
          this.props.changeAlertedNetworkError(err);
          //alert(err)
        }
      );
    });
  };
  getWeightPreference = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    httpRequest.get(
      Constants.GET_WEIGHT_PREFERENCE + userId,
      null,
      (promise) => {
        promise.then(
          (result) => {
            console.log("result getWeightPreference :>> ", result);
            if (result.unitsOfMeasure == "lbs") {
              this.setState({ switchLb: true });
            } else {
              this.setState({ switchLb: false });
            }
            if (result.WCUnitMeasure == "in") {
              this.setState({ switchIn: true });
            } else {
              this.setState({ switchIn: false });
            }
            this.getProfileDetails();
          },
          (err) => {
            console.log("error promise", err); // Error: "It broke"
            //alert(err)
            this.props.changeAlertedNetworkError(err);
          }
        );
      }
    );
    console.log(
      "🚀 ~ file: ProfileScreen.js ~ line 161 ~ ProfileScreen ~ getWeightPreference= ~ this.props.isUserConnectedCarePlus",
      this.props.isUserConnectedCarePlus
    );
    if (
      this.props.isUserConnectedCarePlus &&
      (this.props.isUserConnectedCarePlus == true ||
        this.props.isUserConnectedCarePlus == "true")
    ) {
      this.getPatientGateway();
    }
  };

  getProfileDetails = async () => {
    // const userType = await storageGet(CLStrings.USER_LOGIN_TYPE);
    const userId = await storageGet(CLStrings.USER_ID);
    const epochData = moment(this.props.graphDate).unix();
    const reqBody = {
      userId: userId,
    };
    httpRequest.post(Constants.USER_PROFILE, reqBody, (promise) => {
      promise.then(
        (result) => {
          console.log("result profile :>> ", result);
          let userName = result.firstName + " " + result.lastName;
          var ethIndex = -1;
          var ethnicityML = "";
          var ethnicityDescriptionML = "";
          this.props.racialOrigins.map((ethObj, index) => {
            if (ethObj.ethinictyValue == result?.ethnicity) {
              ethIndex = index;
            }
          });
          if (ethIndex != -1) {
            ethnicityML = this.props.racialOrigins[ethIndex].ethinictyLabel;
            if (
              this.props.racialOrigins[ethIndex].inputType.toLowerCase() ==
              "dropdown"
            ) {
              this.props.racialOrigins[ethIndex].subType.map(
                (ethSubObj, index) => {
                  console.log(ethSubObj.value, result?.ethnicityDescription);
                  if (ethSubObj.value == result?.ethnicityDescription) {
                    ethnicityDescriptionML = ethSubObj.label;
                  }
                }
              );
            } else if (
              this.props.racialOrigins[ethIndex].inputType.toLowerCase() ==
              "radioonly"
            ) {
              let label = "";
              let subType = this.props.racialOrigins[ethIndex].subType;
              if (subType.length > 0) {
                label = subType[0].label;
                if (subType.length > 1) {
                  for (let index = 1; index < subType.length; index++) {
                    const element = subType[index];
                    label = label + " , " + element.label;
                  }
                }
                ethnicityDescriptionML = label;
              }
            } else {
              ethnicityDescriptionML = result?.ethnicityDescription;
            }
          }
          //Ethnicity Find Language End
          let userDetailsObj = {
            name: result.firstName + " " + result.lastName,
            fName: result.firstName,
            lName: result.lastName,
            gender: result.gender,
            dob: dateToStringFormat(result.dateOfBirth),
            quarentineAddress: result.address,
            weight: this.state.switchLb
              ? parseFloat(Constants.convertKGToLBS(result.weight)).toFixed(1)
              : parseFloat(result.weight).toFixed(1),
            waistCircumference: result.waistCircumference
              ? this.state.switchIn
                ? parseFloat(
                    Constants.convertINtoCMS(result.waistCircumference)
                  ).toFixed(1)
                : parseFloat(result.waistCircumference).toFixed(1)
              : 0,
            height: result.height,
            onBoardDate: result.onBoardDate,
            server_time: result.server_time, //for genral reading edit or not only,
            identityNumber:
              result.identityNumber != undefined
                ? result.identityNumber != null
                  ? result.identityNumber
                  : ""
                : "",
            ethnicity: result?.ethnicity || "",
            ethnicityDescription: result?.ethnicityDescription || "",
            ethnicityML: ethnicityML, //result?.ethnicity || "",
            ethnicityDescriptionML: ethnicityDescriptionML,
            iGender: result?.iGender || "",
            iGenderDescription: result?.iGenderDescription || "",
            contact: result?.contact || "",
            callingCode: result?.callingCode || "",
            email: result?.email,
            practiceLicenseNumber: result?.practiceLicenseNumber,
            practiceLicenseValidDate:
              result?.practiceLicenseDate != ""
                ? dateToStringFormat(result?.practiceLicenseDate)
                : "",
          };
          let homeAddressObj = {
            email: result.email,
            practiceLicenseNumber: result.practiceLicenseNumber,
            practiceLicenseValidDate: result.practiceLicenseDate,
            address: result.address,
            city: result.city,
            state: result.state,
            country: result.country,
            zipcode: result.zip,
            callingCode: result?.callingCode || "",
            contact: result?.contact || "",
          };
          var homeAddressTxt = "";
          if (homeAddressObj.address != "" && homeAddressObj.address != null) {
            homeAddressTxt = homeAddressObj.address;
          }
          if (homeAddressObj.city != "" && homeAddressObj.city != null) {
            homeAddressTxt = homeAddressTxt + ", " + homeAddressObj.city;
          }
          if (homeAddressObj.state != "" && homeAddressObj.state != null) {
            homeAddressTxt = homeAddressTxt + ", " + homeAddressObj.state;
          }
          if (homeAddressObj.country != "" && homeAddressObj.country != null) {
            homeAddressTxt = homeAddressTxt + ", " + homeAddressObj.country;
          }
          if (homeAddressObj.zipcode != "" && homeAddressObj.zipcode != null) {
            homeAddressTxt = homeAddressTxt + ", " + homeAddressObj.zipcode;
          }

          this.setState(
            {
              userDetails: userDetailsObj,
              homeAddress: homeAddressObj,
              homeAddressText: homeAddressTxt,
            },
            () => {
              console.log("this.state :>> ", this.state);
            }
          );
        },
        (err) => {
          //console.log("error promise", err); // Error: "It broke"
          //alert(err)
        }
      );
    });
  };
  getRacialOriginList = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    const reqBody = {
      userId: userId,
    };
    httpRequest.post(Constants.GET_RACIAL_ORIGIN_LIST, reqBody, (promise) => {
      promise.then(
        (result) => {
          if (result.length > 0) {
            console.log("GET_RACIAL_ORIGIN_LIST", result);
            this.props.setRacialOriginList(result);
          }
        },
        (err) => {
          console.log("err :>> ", err);
          this.props.changeAlertedNetworkError(err);
        }
      );
    });
  };
  getHeightPreference = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    let reqBody = {
      userId: userId,
    };
    console.log(
      "🚀 ~ file: ProfileScreen.js ~ line 116 ~ ProfileScreen ~ getHeightPreference= ~ reqBody",
      reqBody
    );

    httpRequest.post(Constants.GET_HEIGHT_PREFERENCE, reqBody, (promise) => {
      promise.then(
        (result) => {
          console.log("height result :>> ", result);
          this.setState({
            heightPreference: result.heightPref,
          });
        },
        (err) => {
          console.log("error promise", err); // Error: "It broke"
          // alert(err)
        }
      );
    });
  };
  //Get Medical History Details service call
  getOnSetSysmptoms = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    const reqBody = {
      userId: userId,
    };
    httpRequest.post(Constants.USER_ONSET_SYMPTOMS, reqBody, (promise) => {
      promise.then(
        (result) => {
          console.log("USER_ONSET_SYMPTOMS", result);
          this.parseResponseOnSet(result);
        },
        (err) => {
          //console.log("error promise", err); // Error: "It broke"
          //alert(err)
        }
      );
    });
  };
  parseResponseOnSet = (result) => {
    let symptomOnset = result.symptomOnset;
    let vitalSigns = result.vitalSigns;
    var date = "",
      symptomsSet = "";
    if (symptomOnset.dateOfSymptom) {
      date = moment(symptomOnset.dateOfSymptom).format("D MMM YYYY");
    }
    if (result.symptomOnset) {
      symptomsSet = symptomOnset.symptoms;
    }

    let newSymptomsSet = symptomsSet;

    if (String(newSymptomsSet).trim().endsWith(";")) {
      newSymptomsSet = String(newSymptomsSet)
        .trim()
        .substring(0, String(newSymptomsSet).trim().length - 1);
    }

    var onSetSymptomsObj = {
      dateOfSymptom: date,
      // "symptoms": symptomsSet != undefined && symptomsSet.length > 0 ? String(symptomsSet).trim().substring(0, String(symptomsSet).trim().length - 1) : "",
      symptoms: newSymptomsSet,
      temperature: vitalSigns.temperatureLocation,
      temperatureLocationKey: vitalSigns.temperatureLocationKey,
      heartBeatPerMin: vitalSigns.heartBeatPerMin,
      bloodPressure: vitalSigns.bloodPressure,
      oxygenSaturation: vitalSigns.oxygenSaturation,
      respiratoryRate: vitalSigns.respiratoryRate,
    };

    this.setState({
      onSetSymptoms: onSetSymptomsObj,
    });
  };
  getLifeStyleDetail = async () => {
    const userId = await storageGet(CLStrings.USER_ID);
    const reqBody = {
      userId: userId,
    };
    httpRequest.get(
      Constants.GET_LIFE_STYLE + "?userId=" + userId,
      "",
      (promise) => {
        promise.then((result) => {
          console.log("lifestyle success=====" + JSON.stringify(result));
          let currentListServer =
            result?.data?.smokeHabit.currentSmokeSelectionDetails;
          let currentList = JSON.parse(
            JSON.stringify(this.state.currentDefaultList)
          );
          if (currentListServer.length > 0) {
            for (let i = 0; i < currentList.length; i++) {
              for (let j = 0; j < currentListServer.length; j++) {
                if (currentList[i].type === currentListServer[j]) {
                  currentList[i].value = true;
                }
              }
            }
          }
          let pastListServer =
            result?.data?.smokeHabit.pastSmokeSelectionDetails;
          let pastList = JSON.parse(JSON.stringify(this.state.pastDefaultList));
          if (pastListServer.length > 0) {
            for (let i = 0; i < pastList.length; i++) {
              for (let j = 0; j < pastListServer.length; j++) {
                if (pastList[i].type === pastListServer[j]) {
                  pastList[i].value = true;
                }
              }
            }
          }
          console.log("currentList & pastList", currentList, pastList);
          let obj = {
            smokeHabit: result?.data?.smokeHabit,
            drinkHabit: result?.data?.drinkHabit,
          };
          this.setState({
            lifeStyleData: obj,
            currentList: currentList,
            pastList: pastList,
          });
        });
      },
      (err) => {
        console.log("error promise", err); // Error: "It broke"
        //alert(err)
      }
    );
  };
  calculateCompletedSection = () => {
    let completedSections = 0;
    if (isProfileComplete) {
      completedSections = completedSections + 1;
    }
    if (isRacialOriginComplete) {
      completedSections = completedSections + 1;
    }
    if (isMedicalBackgroundCompete) {
      completedSections = completedSections + 1;
    }
    if (isGenralReadingsComplete) {
      completedSections = completedSections + 1;
    }
    if (isLifeStyleComplete) {
      completedSections = completedSections + 1;
    }
  };

  //profile progress bar

  renderProgressBar = () => {
    var { language } = this.props;
    var finalView = <View />;
    var subviews = [];
    for (let index = 0; index < this.state.totalSections; index++) {
      let emptyView = (
        <View
          style={[
            styles.progressView,
            {
              marginRight: index < 4 ? 5 : 0,
              backgroundColor:
                index < this.state.completedSections //1 < 0 false goto  else
                  ? CLColors.APP_MAIN_THEME
                  : CLColors.EMPTY_PROGRESS_VIEW,
            },
          ]}
        ></View>
      );
      subviews.push(emptyView);
    }
    finalView = (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.progressViewSection}>{subviews}</View>
        <Text style={styles.sectionText}>
          <Text style={styles.sectionTextCompleted}>
            {this.state.completedSections}
          </Text>
          {" / "}
          {this.state.totalSections} {language?.sections_completed}
        </Text>
        <CLBorder width="100%" />
      </View>
    );
    return finalView;
  };

  onEditPersionalInfo = () => {
    this.props.navigation.navigate("EditPersonalInfoScreen", {
      location: this.props.objectLocation,
    });
  };
  onEditRacialOrigin = () => {
    this.props.navigation.navigate("EditRacialOriginScreen", {
      userDetails: this.state.userDetails,
      HomeAddress: this.state.homeAddress,
    });
  };
  onEditMedicalBackground = () => {
    this.props.navigation.navigate("MedicalIdScreen");
  };
  onEditGenralReading = () => {
    if (
      this.state.userDetails.weight != "" ||
      this.state.userDetails.weight.length > 0 ||
      this.state.userDetails.height != "" ||
      this.state.userDetails.height.length > 0
    ) {
      this.props.navigation.navigate("ParkinsonSpecificsScreen", {
        Symptoms: this.state.onSetSymptoms,
        userData: this.state.userDetails,
        weightPreference: this.state.switchLb,
        heightPreference: this.state.heightPreference,
        waistPreference: this.state.switchIn,
      });
    }
  };
  onEditLifeStyle = () => {
    this.props.navigation.navigate("EditLifeStyleScreen", {
      userDetails: this.state.userDetails,
      HomeAddress: this.state.homeAddress,
      lifeStyleData: this.state.lifeStyleData,
    });
  };
  onEditPress = (type) => {
    switch (type) {
      case SectionTypes.PERSONAL:
        this.onEditPersionalInfo();
        break;
      case SectionTypes.RACIAL:
        this.onEditRacialOrigin();
        break;
      case SectionTypes.MEDICAL:
        this.onEditMedicalBackground();
        break;
      case SectionTypes.GENRAL:
        this.onEditGenralReading();
        break;
      case SectionTypes.LIFESTYLE:
        this.onEditLifeStyle();
        break;
      default:
        break;
    }
  };
  renderIncompleteView = (title, type) => {
    var { language } = this.props;

    return (
      <View style={styles.incompleteView}>
        <View style={styles.incompleteTitleView}>
          <Text style={styles.incompleteTitle}>{title}</Text>
          <TouchableOpacity onPress={() => this.onEditPress(type)}>
            <Image
              source={CLImages.EDIT_IMAGE}
              style={[styles.editIcon, { tintColor: CLColors.APP_MAIN_THEME }]}
              resizeMode={"contain"}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.incompleteIconView}>
          <Text style={styles.incomplete}>{language?.Incomplete}</Text>
          <Image
            source={CLImages.IMG_INVALID_PHONE}
            style={[
              styles.incompleteIcon,
              { tintColor: CLColors.APP_MAIN_THEME },
            ]}
            resizeMode={"contain"}
          ></Image>
        </View>
      </View>
    );
  };
  renderRacialOriginView = (title, type) => {
    var { language } = this.props;
    return (
      <View style={styles.incompleteView}>
        <View style={styles.incompleteTitleView}>
          <View style={styles.titleRow}>
            <Text style={styles.incompleteTitle}>{title}</Text>
            <Image
              source={CLImages.GREEN_CHECKBOX}
              style={styles.checkIcon}
              resizeMode={"contain"}
            ></Image>
          </View>
          <TouchableOpacity onPress={() => this.onEditPress(type)}>
            <Image
              source={CLImages.EDIT_IMAGE}
              style={styles.editIcon}
              resizeMode={"contain"}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={{ height: 12 }} />
        <CLBorder width="100%" />
        <View style={{ height: 12 }} />
        <Text style={styles.racialOrigins}>
          {this.state.userDetails?.ethnicityDescriptionML != ""
            ? `${this.state.userDetails?.ethnicityML} - ${this.state.userDetails?.ethnicityDescriptionML}`
            : this.state.userDetails?.ethnicityML}
        </Text>
      </View>
    );
  };
  render() {
    var { language } = this.props;
    return (
      <SafeAreaView style={CLCommonStyles.safeArea}>
        <CLHeader
          header={language?.My_Profile}
          leftOnPress={() => {
            this.props.navigation.goBack();
          }}
        />
        <CLSubHeadText text="" />
        <CLBorder width="100%" />
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Text style={styles.profileCompletion}>
            {language?.Profile_Completion}
          </Text>
          {this.renderProgressBar()}
          {this.state.isProfileComplete ? (
            this.state.userDetails && this.state.homeAddress ? (
              <Profile
                userDetails={this.state.userDetails}
                homeAddress={this.state.homeAddress}
                onEditPress={this.onEditPress}
                type={SectionTypes.PERSONAL}
              />
            ) : null
          ) : (
            this.renderIncompleteView(
              language?.Personal_and_Contact_Info,
              SectionTypes.PERSONAL
            )
          )}
          {this.state.isRacialOriginComplete
            ? this.renderRacialOriginView(
                language?.Racial_Origin,
                SectionTypes.RACIAL
              )
            : this.renderIncompleteView(
                language?.Racial_Origin,
                SectionTypes.RACIAL
              )}
          {this.state.isMedicalBackgroundCompete &&
          this.state.medicalData != null ? (
            <MedicalBackground
              medicalData={this.state.medicalData}
              onEditPress={this.onEditPress}
              type={SectionTypes.MEDICAL}
            />
          ) : (
            this.renderIncompleteView(
              language?.Medical_Background,
              SectionTypes.MEDICAL
            )
          )}
          {this.state.isGenralReadingsComplete ? (
            this.state.userDetails && this.state.homeAddress ? (
              <GenralRadings
                userDetails={this.state.userDetails}
                homeAddress={this.state.homeAddress}
                onSetSymptoms={this.state.onSetSymptoms}
                onEditPress={this.onEditPress}
                heightPreference={this.state.heightPreference}
                switchLb={this.state.switchLb}
                switchIn={this.state.switchIn}
                type={SectionTypes.GENRAL}
              />
            ) : null
          ) : (
            this.renderIncompleteView(
              language?.General_Readings,
              SectionTypes.GENRAL
            )
          )}
          {this.state.isLifeStyleComplete ? (
            <LifestyleComplete
              lifeStyleData={this.state.lifeStyleData}
              currentList={this.state.currentList}
              pastList={this.state.pastList}
              onEditPress={this.onEditPress}
              type={SectionTypes.LIFESTYLE}
            />
          ) : (
            this.renderIncompleteView(
              language?.Lifestyle,
              SectionTypes.LIFESTYLE
            )
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    isSharingOn: state.isSharingOn,
    isQuarantineOn: state.isQuarantineOn,
    userType: state.loginType,
    language: state.language,
    languageCode: state.languageCode,
    racialOrigins: state.racialOrigins,
    objectLocation: state.objectLocation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRacialOriginList: (data) => dispatch(setRacialOriginList(data)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
