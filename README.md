# System Engineering Engaging Project

## Entities Design
* **Teacher**
    * Name: String
    * Email: String
    * Classes: Class[]
    * id: String
    * isVerified: Boolean
* **Class**
    * IsActive: Boolean
    * Profiles: Profile[]
    * TeacherId: String
        * The teacher’s ID
    * StudentsId: String[]
        * A array made of student’s ID
    * Topics: Topic[]
    * ClassId: string
    * Term: string
    * Schedule: string
* **Topic**
    * Name: String
    * Activities: {
        * profile: String
        * profileActivities: {
          * difficulty: "Easy" | "Hard" | "Medium",
          * podiumFirst: String
          * podiumSecond: String
          * podiumThird: String
          * activityId: String
        }
    }[]
* **Profile**
    * Name: String
    * hasActivities: boolean
    * Description: String
    * images: Object
        * MainIcon: String
* **Student**
    * Name: String
    * StudentId: String
    * Profile: Profile
    * Points: number
    * BelongedClassId: String