### Deployment instructions

#### Step to release a build

#### Native

* Bump npm version

  `npm version <semver-version> -m " %s - message"`

      eg. `npm version "0.1.7` -m " %s - bump version for QA release'
      The above command will

        * update `package.json` version
        * update the `CFBundleShortVersionString` and versionName to 0.1.7 for ios and android respectively.
        * make a commit '0.1.7 - bump version for QA release'

* Generate build

      # iOS
      build release for *CopartTransporter* Scheme -> archive -> upload to test fairy

      # Android
      cd android && ./gradlew assembleRelease -> upload signed APK to wiki

  #

  OR

  #

  #### Code-push

      code-push release-react <appName> <platform> -m --description "message" --targetBinaryVersion <versionName>

      # The app versionName may be an exact version that is to be targetted or a semver expression

      # iOS
      code-push release-react narendra.bagade/CopartTransporter-iOS ios -m --description "message" --targetBinaryVersion "1.7.0"

      # Android
      code-push release-react narendra.bagade/CopartTransporter-Android android -m --description "message" --targetBinaryVersion "1.7.0"


      View deployment history
      code-push deployment history narendra.bagade/CopartTransporter-Android Staging

#### Other code-push commands

      # List all deployment configurations
      code-push deployment ls narendra.bagade/CopartTransporter-Android
