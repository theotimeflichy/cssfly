import unittest
import subprocess
import filecmp

class Test(unittest.TestCase):
    
    def test_nested_1(self):

        command = ["node", "../app.js", ".\input\\test_nested_1.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_nested_1.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_nested_2(self):

        command = ["node", "../app.js", ".\input\\test_nested_2.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_nested_2.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")
    
    def test_variable_1(self):

        command = ["node", "../app.js", ".\input\\test_variable_1.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_variable_1.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_variable_2(self):

        command = ["node", "../app.js", ".\input\\test_variable_2.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_variable_2.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_variable_3(self):

        command = ["node", "../app.js", ".\input\\test_variable_3.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_variable_3.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_import_1(self):

        command = ["node", "../app.js", ".\input\\test_import_1.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_import_1.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_import_2(self):
                
        # Ce test faisant appelle à des ressources externes, 
        # il se peut qu'il soit faux si les ressources en questions ont été modifiés.

        command = ["node", "../app.js", ".\input\\test_import_2.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_import_2.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_comment_1(self):

        command = ["node", "../app.js", ".\input\\test_comment_1.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_comment_1.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")

    def test_each_1(self):

        command = ["node", "../app.js", ".\input\\test_each_1.cssfly", ".\\test.css"]
        subprocess.run(command, check=True)

        with open('.\\test.css', 'r') as f1, open('.\\output\\test_each_1.css', 'r') as f2:
            content1 = f1.read()
            content2 = f2.read()
            self.assertEqual(content1, content2, "Le fichier generé n'est pas égal au résultat attendu.")


if __name__ == '__main__':
    unittest.main();