# Solution Export and Project Build

This document provides instructions for exporting a solution and building a project for the first time.

## Initial Project Setup

1. **Build the Project**
   - Run the following command:
     ```bash
     npm run build
     ```

2. **Create a Destination Folder**
   - Create a new folder to export the solution:
     ```bash
     mkdir DestinationFolder
     ```

3. **Navigate to the Destination Folder**
   - Change your directory to the newly created folder:
     ```bash
     cd DestinationFolder
     ```

4. **Initialize the Solution**
   - Run the following commands:
     ```bash
     pac solution init --publisher-name syncmusic --publisher-prefix sync
     pac solution add-reference --path ../
     dotnet restore
     dotnet build
     ```
   - **Note:**
     - `--publisher-name`: The publisher that will appear in the solution.
     - `--publisher-prefix`: The prefix for the solution.

5. **Locate the Exported Solution**
   - After executing the commands, your solution will be available as a `.zip` file in:
     ```
     ./DestinationFolder/bin/Debug/
     ```

## Updating an Existing Solution

1. **Build the Project**
   - Run the following command:
     ```bash
     npm run build
     ```

2. **Navigate to Your Existing Solution Folder**
   - Change your directory to the existing solution folder:
     ```bash
     cd YourExistingSolutionFolder
     ```

3. **Update the Solution**
   - Execute the following commands:
     ```bash
     ..\Update-SolutionString.ps1
     pac solution add-reference --path ../
     dotnet restore
     dotnet build
     ```

> **Important:** The file `Update-SolutionString.ps1` must exist in the parent directory.

---
This guide should help streamline your project build and solution export process. If you have any questions, feel free to ask!