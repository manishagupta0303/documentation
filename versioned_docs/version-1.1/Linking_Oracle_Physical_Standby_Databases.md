---
sidebar_position: 3
title: Linking Oracle Physical Standby Databases
---

This topic describes special considerations for linking Oracle physical standby databases.

The Delphix Engine supports linking both physical and logical standby databases. In previous versions of the Delphix Engine, limitations were placed upon support for Oracle RAC physical standby databases in Real-Time Apply mode. In version 3.0 of the Delphix Engine, these restrictions were lifted.

:::info Using Block Change Tracking (BCT) on a Physical Standby Database
In general, Delphix recommends enabling Block Change Tracking (BCT) on a primary or standby source database. See [Phys](#id-.LinkingOraclePhysicalStandbyDatabasesvLumenMaint-matrix)[ical](#id-.LinkingOraclePhysicalStandbyDatabasesvLumenMaint-matrix) [Standby Database Support Matrix](#id-.LinkingOraclePhysicalStandbyDatabasesvLumenMaint-matrix) below for restrictions on enabling BCT on a standby database.
    
BCT is available from Oracle release 11.1.0.6 onward for physical standby databases **only** if they are licensed for the Active Data Guard option.
    
* Release 11.1.0.6 is unstable for the BCT on physical standby feature
* Release 11.1.0.7 requires a patch for Oracle bugs 7613481, 9068088
* Release 11.2.0.2 requires patches for Oracle bugs 10170431, 12312133
* Release 11.2.0.3 requires patches for Oracle bugs 12312133, 16052165,

Patches Required

BCT on a primary database has been stable since Oracle version 10.2.0.5. In order to make use of BCT (>11.2.0.4), The Physical Standby Database must be in a "Managed Recovery Mode", i.e. achieved using "ALTER DATABASE RECOVER **MANAGED** STANDBY DATABASE'.
:::

:::note
Enabling BCT on a physical standby database without these patches is **not recommended** because of serious performance and stability issues.
:::

## Physical Standby Database Support Matrix

| Oracle Version | Apply Mode | Notes |
| --- | --- | --- |
| 10.2, 11.x and 12.x in **Level** **Backup** mode; 10.2 and 12.x in **SCN** **Backup** mode | Archive Apply mode | No special restrictions. |
|     | Real-Time Apply mode | LogSync must be enabled. |
| 11.x in **SCN Backup** mode | Archive Apply mode | If the Physical Physical Standby Database is at version 11.2.0.4 or above, no special actions are required. Due to Oracle bug 10146187, **Redo Apply** must be stopped and the database opened in **read-only** mode during SnapSync. See the section _Stopping and Restarting Redo Apply_ below for more information. |
|     | Real-Time Apply mode | If the Physical Physical Standby Database is at version 11.2.0.4 or above, no special actions are required. LogSync must be enabled. Due to Oracle bug 10146187, **Redo Apply** must be stopped and the database opened in **read-only** mode during SnapSync. See the section _Stopping and Restarting Redo Apply_ below for more information. In addition, to avoid Oracle Bug 13075226, which results in a hang during the restart of Redo Apply, Delphix requires disabling using BCT on the standby database. The hang occurs when BCT is enabled on a standby database that uses SCN backup mode. **Note:** Patch Required SnapSync will fail If running Oracle 11.2 before 11.2.0.4 when using SCN backups and real-time apply mode, Use level based backups instead. If the Oracle installation has already been patched for Oracle bug 13075226, or once the patch is applied, use the CLI to update the repository for this installation so that applied Patches include Oracle bug number 13075226. If the repository does not indicate that Oracle bug 13075226 for the repository has been addressed, SnapSync will not be possible when using SCN backups and real-time apply. See _Updating Repository for Oracle applied patches with the Command Line Interface_ below for details on how to update the repository. |
| 18.0.0.0 - 19.3.0.0 | Real-Time Apply mode | Oracle patch 29056767 installed, Failure to install this patch may result in SnapSync failure with error. |

## Level Backup Mode for SnapSync

By default, the Delphix Engine's SnapSync feature uses **SCN Backup** mode and is designed to not interfere with other backups that may already be in use. However, in cases where RMAN is not being used outside of the Delphix Engine, the Delphix Engine can use the **Level Backup** mode that improves SnapSync behavior on Oracle 11g physical standby databases. In this mode, **redo apply** does not have to be stopped during SnapSync. See [Advanced Data Management Settings for Oracle dSources](/display/DOCSDEV2019/.Data+Management+Settings+for+Oracle+Data+Sources+vLumenMaint) for more information about SnapSync settings.

### Requirements for Using Level Backup Mode

 Customer not backing up their physical standby with RMAN:

* Set CONTROL\_FILE\_RECORD\_KEEP\_TIME to 365

 OR all of the following:

* Physical standby database running Oracle 11.2.0.2 or later version
* All RMAN backups must use tags
* RMAN CROSSCHECK commands must specify tags
* RMAN DELETE commands must specify tags
* RMAN DUPLICATE commands must specify tags
* Set CONTROL\_FILE\_RECORD\_KEEP\_TIME to 365

:::warning
Failure to meet all of these requirements will cause external RMAN backups to be incomplete or result in corrupt SnapSync snapshots. Switching from SCN to LEVEL mode will force a new LEVEL 0 backup.
:::

## Stopping and Restarting Redo Apply

Oracle bug 10146187 requires stopping of redo apply before an SCN-based incremental backup can be issued. These scripts can be used as pre- and post-scripts during the dSource linking process to stop and restart **Redo Apply**.

* SnapSync pre-script: [disableStandby.sh.template](/download/attachments/128029950/disableStandby.sh%20%288%29.template?version=1&modificationDate=1585680800577&api=v2)
* SnapSync post-script: [enableStandby.sh.template](/download/attachments/128029950/enableStandby.sh%20%283%29.template?version=1&modificationDate=1585680800557&api=v2)

These scripts must be modified for local use, particularly in regard to whether the physical standby database operates in MOUNTED or OPEN mode.

:::warning
Failure to properly customize these scripts could violate your Oracle license terms by running redo apply on an open database, which requires an Oracle Active Data Guard license.
:::

## Linking and Provisioning a Mounted Standby

:::warning
When you link a standby database in the mounted mode and have not been opened read-only, the data files for temporary tablespaces will be present in v$tempfile but will not actually be created yet, and therefore will indicate 0 file size. As a result, any VDB provisioned from a snapshot taken in this state will end up with the same tablespaces and datafiles created, but with a default file size of 52428800 bytes.

For databases that are in the **mounted** state, the Delphix database user account must be **SYS** (having the **SYSDBA** role), **SYSBACKUP** (having the **SYSBACKUP** role) or **SYSDG** (having the **SYSDG** role).
:::

:::note
**SYSBACKUP** and **SYSDG** roles are only available in Oracle 12.1 and later releases.
:::

However, for an **open** standby (Active Data Guard) database, only a regular database user account is required.

Connecting to a **mounted** standby with a **SYS** user account requires that the mounted standby be configured with a password file. Delphix does not capture the password file during SnapSync, and for this reason, cannot provision or sync validate a database with a SYS user. A secondary, regular database user account can be specified through either the**Delphix Management** application or CLI. This database user will then be used to connect to the database during provisioning and validated sync. Note that the **SYS** user is still required to perform snapshots of the source database.

In the **Delphix Management** application, the **non-SYS user** can be specified from within the **Add dSource** wizard, or on the back of the Oracle dSource after linking.

## Configuring a Standby PDB in Mount Mode

To configure a standby PDB in the mount mode, you must also provide a non-SYS user for both the CDB and the PDB. The PDB non-SYS user can only be added via the CLI. You must perform a fresh SnapSync after adding the non-SYS user.

### Pre-requisite

In order for Delphix Engine to connect, you must configure a static listener configuration for the PDB. You can configure a static listener by adding a configuration into listener.ora and restarting the listener.

    SID_LIST_LISTENER=`=
    (SID_DESC=
    (GLOBAL_DBNAME=CDOMLOSR4F71PDB1)
    (SID_NAME=stby18c)
    (ORACLE_HOME=/u01/app/oracle/product/18.0.0.0/dbhome_1)
    )
    )

In the above example configuration, GLOBAL\_DBNAME is the PDB name and SID\_NAME is the SID of the CDB.

#### Procedure

Run the following commands to configure a PDB and CDB in the mount mode.

1. Update PDB non-SYS user.

        delphix> /sourceconfig
        delphix sourceconfig> select RH74PDB04
        delphix sourceconfig 'RH74PDB04'> update
        delphix sourceconfig 'RH74PDB04' update *> set nonSysUser=delphix
        delphix sourceconfig 'RH74PDB04' update *> set nonSysCredentials.type=PasswordCredential
        delphix sourceconfig 'RH74PDB04' update *> set nonSysCredentials.password=delphix
        delphix sourceconfig 'RH74PDB04' update *> commit;

2. Update CDB non-SYS user.

        delphix> /sourceconfig
        delphix sourceconfig> select rh74cdb2
        delphix sourceconfig 'rh74cdb2'> update
        delphix sourceconfig 'rh74cdb2' update *> set nonSysUser=delphix
        delphix sourceconfig 'rh74cdb2' update *> set nonSysCredentials.type=PasswordCredential
        delphix sourceconfig 'rh74cdb2' update *> set nonSysCredentials.password=delphix
        delphix sourceconfig 'rh74cdb2' update *> commit;
        delphix sourceconfig 'rh74cdb2'>

3. Perform sync of the PDB.

        delphix> /database
        delphix database> select RH74PDB04
        delphix database 'RH74PDB04'> sync

## Setting the Non-Sys User on the Oracle dSource

1. Create the delphix\_db user in the primary database.
2. Log into the Delphix Management application.
3. From the **Manage** menu, select **Datasets.**
4. From the Configuration tab select the Oracle dSource for which you want to add a **non-SYS** user.
5. Click the dSource's icon to open the dSource information pane.
6. Click the Edit button next to **Non-SYS User**.
7. Enter a non-SYS user and credentials that exist on the standby.
8. Click the **Accept** button to save this user and associated credentials.

The non-SYS user will be used to connect to all VDBs provisioned from snapshots of this dSource that are created after the non-Sys user has been set.

## Updating repository for applied patches with the Command Line Interface

1. Select the repository of the database

        delphix> repository select '/opt/app/oracle/product/11.2.0.2/db_1'        

2. Execute the `update` command.

        delphix repository ''/opt/app/oracle/product/11.2.0.2/db_1''> update

3. Set `appliedPatches` to list current patches applied to the repository.

        delphix repository ''/opt/app/oracle/product/11.2.0.2/db_1''update *> set appliedPatches=13075226

4. `Commit` the operation.

        delphix repository ''/opt/app/oracle/product/11.2.0.2/db_1''update *> commit

Setting the Non-Sys User with the Command Line Interface

1. Select the `source config` of the mounted standby.

        delphix> sourceconfig select pomme

2. Execute the `update` command.

        delphix sourceconfig "pomme"> update

3. Set the `nonSysUser` and `nonSysCredentials` to a non-SYS user that exists on standby.

        delphix sourceconfig "pomme" update *> set nonSysUser=<non-sys-username>
        delphix sourceconfig "pomme" update *> set nonSysCredentials.type=PasswordCredential
        delphix sourceconfig "pomme" update *> set nonSysCredentials.password=<non-sys-password>

4. Commit the operation.

        delphix sourceconfig "pomme" update *> commit

## Related Topics

* [Data Management Settings for Oracle Data Sources](/display/DOCSDEV2019/.Data+Management+Settings+for+Oracle+Data+Sources+vLumenMaint)
* [Advanced Linking](/display/DOCSDEV2019/.Advanced+Linking+vLumen_6.x)
