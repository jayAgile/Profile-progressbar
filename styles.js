import { StyleSheet } from "react-native";
import CLColors from "../../../res/CLColors";
import CLCommonStyles from "../../../res/CLCommonStyles";
import CLFonts from "../../../res/CLFonts";
import CLStyles from "../../../res/CLStyles";
import { DEVICE_WIDTH } from "../../../utils/Util";

const styles = StyleSheet.create({
    container: {
        ...CLCommonStyles.primaryContainer,
        paddingHorizontal: 24
    },
    profileCompletion: {
        fontFamily: CLFonts.SemiBold,
        fontSize: 24,
        color: CLColors.APP_MAIN_THEME,
    },
    progressViewSection: {
        marginTop: 16,
        flexDirection: "row"
    },
    progressView: {
        height: 8,
        borderRadius: 5,
        backgroundColor: CLColors.EMPTY_PROGRESS_VIEW,
        width: (DEVICE_WIDTH - 68) / 5
    },
    sectionText: {
        marginTop: 12,
        marginBottom: 20,
        ...CLStyles.H6REGULAR,
        fontWeight: "500"
    },
    sectionTextCompleted: {
        color: CLColors.APP_TEXT
    },
    editIcon: {
        width: 28,
        height: 25,
        alignSelf: 'center'
    },
    incompleteView: {
        backgroundColor: CLColors.WHITE,
        padding: 18,
        shadowColor: CLColors.BLACK,
        shadowOffset: { width: 0, height: 4 }, //4 or 10
        shadowRadius: 3,
        shadowOpacity: 0.25,
        elevation: 3,
        borderRadius: 10,
        marginBottom: 10
    },
    incompleteTitleView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    incompleteTitle: {
        ...CLStyles.H5MEDIUM_BLACK,
    },
    incompleteIconView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    incomplete: {
        ...CLStyles.H5MEDIUMLINK,
        marginRight: 8,
        fontSize: 18,
    },
    incompleteIcon: {
        width: 18,
        height: 18,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkIcon: {
        width: 16,
        height: 16,
        alignSelf: 'center',
        marginLeft: 8
    },
    racialOrigins: {
        ...CLStyles.H6LIGHT
    }

})

export default styles