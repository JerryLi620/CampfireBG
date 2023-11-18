import csv


def add_id(file_name, item, ID):
    with open(file_name, 'r') as file:
        content = list(csv.DictReader(open(file_name)))

    items = {}
    count = 1

    for row in content:
        data = row[item]

        if data == '0' or data == 'nan':
            row[item] = 'null'
            row[ID] = 'null'
        elif data in items:
            row[ID] = items[data]
        else:
            row[ID] = count
            items[data] = count
            count += 1

    fieldnames = content[0].keys() if content else []
    with open(file_name, 'w', newline='') as file:
        csv_writer = csv.DictWriter(file, fieldnames=fieldnames)
        csv_writer.writeheader()
        csv_writer.writerows(content)

def clean_nan(file_name):
    with open(file_name, 'r', newline='') as file:
        content = list(csv.DictReader(file))
    

    for row in content:
        for key, value in row.items():
            if value.lower() == 'nan':  
                row[key] = None  
    
    # Get the fieldnames from the first row
    fieldnames = content[0].keys() if content else []

    # Write the modified content back to the file
    with open(file_name, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(content)

if __name__ == "__main__":
    clean_nan('data_cleaned/games.csv')
    add_id('data_cleaned/categorized.csv', 'categories', 'category_ID')
    clean_nan('data_cleaned/categorized.csv')
    add_id('data_cleaned/designed.csv', 'designers', 'designer_ID')
    clean_nan('data_cleaned/designed.csv')
    add_id('data_cleaned/moves.csv', 'mechanics', 'mechanism_ID')
    clean_nan('data_cleaned/moves.csv')
    add_id('data_cleaned/painted.csv', 'artists', 'artist')
    clean_nan('data_cleaned/painted.csv')
    add_id('data_cleaned/published.csv', 'publishers', 'publisher_ID')
    clean_nan('data_cleaned/published.csv')