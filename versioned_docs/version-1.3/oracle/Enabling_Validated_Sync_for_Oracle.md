---
sidebar_position: 1
title: Enabling Validated Sync for Oracle
---

This topic describes the validated sync process for Oracle databases using both the Delphix Management application and Command Line Interface (CLI).

Traditional Oracle dSource snapshots require some recovery during provisioning. By configuring validated sync for Oracle, the Delphix Engine selects a compatible Oracle installation and applies the recovery necessary to provision a snapshot immediately after each SnapSync. Snapshots that have been through this validated sync process step do not require recovery during provisioning.

:::note Validated Sync
The Delphix Engine may be unable to perform validated sync on a physical standby database in Real-Time Apply mode. This is because the standby may apply changes before copying the logs that contain those changes. Without the logs necessary to perform recovery, validated sync cannot be executed. However, you can still provision the snapshot when the archive logs become available on the standby.
:::

## Prerequisite: Designating a Staging Host

In order to validate an Oracle dSource snapshot after a sync, the Delphix Engine requires a host with an Oracle installation that is compatible with the dSource. This machine is known as the **staging** host. You must explicitly designate which machines you want the Delphix Engine to use as staging hosts. All machines that have been marked as staging hosts are added to a pool. During sync validation, the Delphix Engine will select a compatible host from the pool, export the requisite archived redo logs and data files, and execute Oracle media recovery on the host. Follow these steps to designate a staging host.

1. Log into the Delphix Management application.
2. Click **Manage**.
3. Select **Environments**.
4. In the **Environments** panel, select the environment you want to designate as staging.
5. Select the **Databases** tab.
6. Scroll down to the installations you want to designate as staging and edit the **Installation Details** by clicking on the **pencil** icon.
7. Select the **Use as staging** checkbox.
8. Select the green checkmark to confirm your change.

To configure validated sync for multiple dSources with different Oracle versions, you must designate a compatible staging source for each. If multiple compatible staging sites exist, the Delphix Engine will select one at random.

:::warning
The validated sync process will consume some resources on the staging host when snapshots are taken. Designating a performance-critical host as a staging host is not recommended.
:::

:::warning
The default OS user for the staging host must have access to the Oracle installation that will be used to perform recovery during validated sync.
:::

:::info
Validated sync for Oracle pluggable databases is not supported in this release.
:::

## Enabling Validated Sync

Oracle validated sync can be enabled at link time or on any existing dSource. When adding the dSource (at link time), in the Data Management tab, select Show Advanced, and select the Enable checkbox for Validated Sync.

For an existing dSource:

1. Log into the Delphix Management application using **Delphix Admin** credentials.
2. Click **Manage**.
3. Select **Datasets**.
4. In the **Datasets** panel, select the dSource for which you want to enable sync validation.
5. Select the **Configuration** tab and then select the **Data Management** sub-tab.
6. Select the pencil icon located next to the **VALIDATED SYNC CONFIGURATION**.
7. Select one of the following from the **Validated Sync Mode** drop-down list:
    1. Transaction Log
    2. Full or Differential
    3. Full
    4. None
8. Select the checkmark to confirm your change.

## Related Topics

* [Advanced Linking](/display/DOCSDEV2019/.Advanced+Linking+vLumen_6.x)
