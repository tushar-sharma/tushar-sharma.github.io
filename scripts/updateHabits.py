# for google excel
import gspread
import time
from oauth2client.service_account import ServiceAccountCredentials

def main():
    """update google sheet"""

    lower_row = 2
    upper_row = 13

    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

    # add credentials to the account
    creds = ServiceAccountCredentials.from_json_keyfile_name('key.json', scope)

    # authorize the clientsheet
    client = gspread.authorize(creds)

    sheet = client.open("HabitTracker")

    sheet_instance = sheet.worksheet("Habits")

    # rename columns

    for cols in ["N", "M", "L", "K", "J", "I", "H"]:

        for sheet_counter  in range(lower_row, upper_row):

            curr_val = sheet_instance.acell("%s%s"%(cols,sheet_counter)).value

            curr_sheet = chr(ord(cols) + 1)

            print("Copying value from %s%s to %s%s" % (cols, sheet_counter, curr_sheet, sheet_counter))

            sheet_instance.update("%s%s" % (curr_sheet, sheet_counter), curr_val , value_input_option='USER_ENTERED')

        time.sleep(5)



    time.sleep(10)

    for sheet_counter in range(lower_row, upper_row):
        print("Deleting value for H%s" % (sheet_counter))

        sheet_instance.update("H%s" % (sheet_counter), "no" , value_input_option='USER_ENTERED')

    time.sleep(10)

    for sheet_counter in range(lower_row, upper_row):
        print("Deleting value for O%s" % (sheet_counter))
        sheet_instance.update("O%s" % (sheet_counter), "" , value_input_option='USER_ENTERED')


if __name__=="__main__":

    main()
