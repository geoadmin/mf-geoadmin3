mf-chsdi3
=========

next generation of api3.geo.admin.ch

Jenkins Build Status: [![Jenkins Build Status](https://jenkins.dev.bgdi.ch/buildStatus/icon?job=chsdi3)](https://jenkins.dev.bgdi.ch/job/chsdi3/)

# Getting started

Checkout the source code:

    git clone https://github.com/geoadmin/mf-chsdi3.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    git clone git@github.com:geoadmin/mf-chsdi3.git

Add .pgpass to your environment

    cd
    touch .pgpass
    chmod 600 .pgpass

Open .pgpass and Add

    pgcluster0t.bgdi.admin.ch:5432:*:${username}:${pass}
    pgcluster0i.bgdi.admin.ch:5432:*:${username}:${pass}
    pgcluster0.bgdi.admin.ch:5432:*:${username}:${pass}

Make sure PGUSER and PGPASS is set in your .bashrc (for nosetests, potranslate and sphinx)

    export PGUSER=${username} // postgres user (won't be relevant soon)
    export PGPASS=${pass}

Bootstrap your build environment:

    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

Create a developer specific build configuration:

    cp buildout_ltgal.cfg buildout_<username>.cfg

Change the port number in the newly created buildout configuration file (In dev mode)

Where "username" is your specific buildout configuration. Don't forget to add this to git. To create the specific build:

    buildout/bin/buildout -c buildout_<username>.cfg

If you do this on mf1t, you need to make sure that a correct configuration exists under
    
    /var/www/vhosts/mf-chsdi3/conf

that points to your working directory. If all is well, you can reach your pages at:

    http://mf-chsdi3.dev.bgdi.ch/<username>/

# Deploying to dev, int and prod

Do the following commands **inside your working directory**. Here's how a standard
deploy process is done.

`.\deploydev.sh -s`

This updates the source in /var/www...to the latest master branch from github,
creates a snapshot and runs nosetests against the test db. The snapshot directory
will be shown when the script is done. *Note*: you can omit the `-s` parameter if
you don't want to create a snapshot e.g. for intermediate releases on dev main.

Once a snapshot has been created, you are able to deploy this snapshot to a
desired target. For integration, do

`.\deploysnapshot 201407031411 int`

This will run the full nose tests **from inside the 201407031411 snapshot directory** against the integration db cluster. Only if these tests are successfull, the snapshot is deployed to the integration cluster.

`.\deploysnapshot 201407031411 prod`

This will do the corresponding thing for prod

*Note*: older snapshots don't contain the nose_run.sh scripts. To use the above
commands, you have to manually copy the nose_run.sh script into the snapshot code
directory.

# Deploying a branch

Call the `.\deploybranch.sh` script **in your working directory** to deploy your current 
branch to test (Use `.\deploybranch.sh int` to also deploy it to integration).
The code for deployment, however, does not come from your working directory,
but does get cloned (first time) or pulled (if done once) **directly from github**.
So you'll likely use this command **after** you push your branch to github.

The first time you use the command will take some time to execute.

The code of the deployed branch is in a specific directory 
`/var/www/vhosts/mf-geoadmin3/private/branch` on both test and integration.
The command adds a branch specific configuration to
`/var/www/vhosts/mf-geoadmin3/conf`. This way, the deployed branch
behaves exactly the same as any user specific deploy.

Sample path:
http://mf-chsdi3.int.bgdi.ch/gjn_deploybranch/ (Don't forget the slash at the end)

## Get correct back-link to geoadmin3
Per default the back-link to geoadmin3 points to the main instance. If you
want to change that, adapt the `geoadminhost` variable in the
`buildout_branch.cfg.in` input file and commit it in *your branch*.

## Run nosetests manual on different enviroments
We are able to run our integration tests against different staging environments

**For this to work, you need to adapt your personal ~/.pgpass file. It has to
include access information for all clusters (add pgcluster0i and pgcluster0)**

To run against prod environment:
`./nose_run.sh -p`

To run against int environment:
`./nose_run.sh -i`

To run against dev/test environment:
`./nose_run.sh`

To run against your private environment:
`./buildout/bin/nosetests`

# Clean project
In order to reinitialize your project and remove unused eggs do the following commands:

    buildout/bin/buildout -c buildout_cleaner.cfg
    buildout/bin/buildout -c buildout_<username>.cfg

`buildout_cleaner.cfg` will move all the unused eggs into `buildout/old-eggs/`, remove all the `*.mo` translation files, uninstall all the templates and remove all the `*.pyc` files.

If buildout failed previously, you might need to bootstrap the project again, use the following command after the buildout cleaner:

    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

# Python Code Styling

We are currently using the PEP 8 convention for Python code.
You can find more information about our code styling here:

    http://www.python.org/dev/peps/pep-0008/
    http://pep8.readthedocs.org/en/latest/index.html

You can find additional information about autopep8 here:

    https://pypi.python.org/pypi/autopep8/
