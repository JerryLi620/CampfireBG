import csv


def add_id(file_name, item, ID):
    with open(file_name, 'r') as file:
        content = list(csv.DictReader(open(file_name)))

    items = {}
    count = 1

    for row in content:
        data = row[item]

        if data == '0':
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


if __name__ == "__main__":
    add_id('data_cleaned/categorized.csv', 'categories', 'category_ID')
    add_id('data_cleaned/designed.csv', 'designers', 'designer_ID')
    add_id('data_cleaned/moves.csv', 'mechanics', 'mechanism_ID')
    add_id('data_cleaned/painted.csv', 'artists', 'artist')
    add_id('data_cleaned/published.csv', 'publishers', 'publisher_ID')
