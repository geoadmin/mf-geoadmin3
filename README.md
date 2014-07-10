mf-chsdi3
=========

next generation of api.geo.admin.ch


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

# Python Code Styling

We are currently using the PEP 8 convention for Python code.
You can find more information about our code styling here:

    http://www.python.org/dev/peps/pep-0008/
    http://pep8.readthedocs.org/en/latest/index.html

You can find additional information about autopep8 here:

    https://pypi.python.org/pypi/autopep8/
