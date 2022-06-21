# System Engineering Engaging Project

## Entities Design
* **Teacher**
    * Name: String
    * Email: String
    * Classes: Class[]
    * id: String
* **Class**
    * IsActive: Boolean
    * Profiles: Profile[]
    * Name: String
    * Teacher: String
        * The teacher’s ID
    * Students: String[]
        * A array made of student’s ID
    * Topics: Topic[]
* **Topic**
    * Name: String
    * QuestionsPerRole:
        * Role1: number
        * Role2: number
        * …n
* **Profile**
    * Name: String
    * Description: String
    * images: Object
        * MainIcon: String
* **Student**
    * Name: String
    * StudentId: String
    * Profile: Profile
    * Points: number