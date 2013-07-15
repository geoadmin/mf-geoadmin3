Generate the locales files

#Create a virtual environment
virtualenv env

#Activate virtual env
 source env/bin/activate

#Install the dependencies
./env/bin/easy_install psycopg2
./env/bin/easy_install pyyaml

#Start the script (replace ltmoc by your environment)
./env/bin/python translation2js.py /home/ltmoc/mf-geoadmin3/src/locales/
