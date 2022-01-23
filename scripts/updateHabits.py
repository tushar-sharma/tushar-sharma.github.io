# for google excel
import gspread
import time
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime, timedelta

def main():
    """update google sheet"""

    lower_row = 2
    upper_row = 15

    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

    # add credentials to the account
    creds = ServiceAccountCredentials.from_json_keyfile_name('key.json', scope)

    # authorize the clientsheet
    client = gspread.authorize(creds)

    sheet = client.open("HabitTracker")

    sheet_instance = sheet.worksheet("Habits")

    # rename columns

    for cols in ["N", "M", "L", "K", "J", "I", "H"]:

        for sheet_counter  in range(lower_row, upper_row + 1):

            curr_val = sheet_instance.acell("%s%s"%(cols,sheet_counter)).value

            curr_sheet = chr(ord(cols) + 1)

            print("Copying value from %s%s to %s%s" % (cols, sheet_counter, curr_sheet, sheet_counter))

            sheet_instance.update("%s%s" % (curr_sheet, sheet_counter), curr_val , value_input_option='USER_ENTERED')

        time.sleep(15)



    time.sleep(15)

    for sheet_counter in range(lower_row, upper_row + 1):
        print("Deleting value for H%s" % (sheet_counter))

        sheet_instance.update("H%s" % (sheet_counter), "no" , value_input_option='USER_ENTERED')

    time.sleep(15)

    for sheet_counter in range(lower_row, upper_row + 1):
        print("Deleting value for O%s" % (sheet_counter))
        sheet_instance.update("O%s" % (sheet_counter), "" , value_input_option='USER_ENTERED')

    time.sleep(15)

    # update the sheet date
    print("Reseting dates...")
    date_col = "S"
    date_col_row_number = 2

    curr_val = sheet_instance.acell("%s%s"%(date_col,date_col_row_number)).value

    res = (datetime.strptime(curr_val, '%a %b %d %Y') + timedelta(days=1)).strftime('%a %b %d %Y')

    sheet_instance.update("%s%s" % (date_col, date_col_row_number), res , value_input_option='USER_ENTERED')


if __name__=="__main__":

    main()
