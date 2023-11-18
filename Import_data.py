import csv
import mysql.connector


def create_connection():
    # Adjust the connection details accordingly
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='lmy20030620',
        database='BoardgameData'
    )
    return connection


def create_schema(file_name):
    with open(file_name, 'r') as file:
        schema_string = file.read()
    try:
        for result in cursor.execute(schema_string, multi=True):
            pass
    except mysql.connector.Error as error_descriptor:
        if error_descriptor.errno == mysql.connector.errorcode.ER_TABLE_EXISTS_ERROR:
            print("Table already exists: {}".format(error_descriptor))
        else:
            print("Failed creating schema: {}".format(error_descriptor))
        exit(1)


def import_game_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        games = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            games[row['game_id']] = (
                row['game_id'], row['name'], row['type'],
                row['rating'], row['weight'], row['year_published'],
                row['min_players'], row['max_players'], row['min_play_time'],
                row['max_play_time']
            )
        cursor.executemany(
            "INSERT INTO Games VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", list(games.values()))

        connection.commit()


def import_artist_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        artists = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            artists[row['artist_ID']] = (
                row['artist_ID'], row['artists']
            )
        cursor.executemany(
            "INSERT INTO Artists VALUES (%s, %s)", list(artists.values()))

        connection.commit()


def import_designer_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        designers = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            designers[row['designer_ID']] = (
                row['designer_ID'], row['designers']
            )
        cursor.executemany(
            "INSERT INTO Designers VALUES (%s, %s)", list(designers.values()))

        connection.commit()


def import_category_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        categories = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            categories[row['category_ID']] = (
                row['category_ID'], row['categories']
            )
        cursor.executemany(
            "INSERT INTO Categories VALUES (%s, %s)", list(categories.values()))

        connection.commit()


def import_mechanic_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        mechanics = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            mechanics[row['mechanism_ID']] = (
                row['mechanism_ID'], row['mechanics']
            )
        cursor.executemany(
            "INSERT INTO Mechanics VALUES (%s, %s)", list(mechanics.values()))

        connection.commit()


def import_publisher_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        publishers = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            publishers[row['publisher_ID']] = (
                row['publisher_ID'], row['publishers']
            )
        cursor.executemany(
            "INSERT INTO Publishers VALUES (%s, %s)", list(publishers.values()))

        connection.commit()


def import_painted_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        paint = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            paint[row['artist_ID'], row['game_id']] = (
                row['artist_ID'], row['game_id']
            )
        cursor.executemany(
            "INSERT INTO Paints VALUES (%s, %s)", list(paint.values()))

        connection.commit()


def import_designed_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        design = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            design[row['designer_ID'], row['game_id']] = (
                row['designer_ID'], row['game_id']
            )
        cursor.executemany(
            "INSERT INTO Designs VALUES (%s, %s)", list(design.values()))

        connection.commit()


def import_catagorized_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        catagorize = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            catagorize[row['category_ID'], row['game_id']] = (
                row['category_ID'], row['game_id']
            )
        cursor.executemany(
            "INSERT INTO Categorizes VALUES (%s, %s)", list(catagorize.values()))

        connection.commit()


def import_have_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        mechanic = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            mechanic[row['mechanism_ID'], row['game_id']] = (
                row['mechanism_ID'], row['game_id']
            )
        cursor.executemany(
            "INSERT INTO HaveMechanic VALUES (%s, %s)", list(mechanic.values()))

        connection.commit()


def import_publish_data(file_name, cursor, connection):
    with open(file_name, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        publish = {}

        for row in csv_reader:
            row = {k: None if v == '' else v for k, v in row.items()}

            publish[row['publisher_ID'], row['game_id']] = (
                row['publisher_ID'], row['game_id']
            )
        cursor.executemany(
            "INSERT INTO Publishes VALUES (%s, %s)", list(publish.values()))

        connection.commit()


if __name__ == "__main__":
    connection = create_connection()
    cursor = connection.cursor()
    create_schema('BoardGameSchema.sql')
    print("Successfully create schema.")

    import_game_data('data_cleaned/games.csv',cursor, connection)
    import_artist_data('data_cleaned/painted.csv',cursor, connection)
    import_designer_data('data_cleaned/designed.csv',cursor, connection)
    import_category_data('data_cleaned/categorized.csv',cursor, connection)
    import_mechanic_data('data_cleaned/moves.csv',cursor, connection)
    import_publisher_data('data_cleaned/published.csv',cursor, connection)
    import_painted_data('data_cleaned/painted.csv',cursor, connection)
    import_designed_data('data_cleaned/designed.csv',cursor, connection)
    import_catagorized_data('data_cleaned/categorized.csv',cursor, connection)
    import_have_data('data_cleaned/moves.csv',cursor, connection)
    import_publish_data('data_cleaned/published.csv',cursor, connection)
    print("Successfully import data.")

    cursor.close()
    connection.close()
