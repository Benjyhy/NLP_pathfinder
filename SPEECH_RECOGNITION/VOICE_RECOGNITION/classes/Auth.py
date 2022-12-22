class auth:
    def __init__(self, validateMdp):
        self.validate = validateMdp

    def checkingMdp(self, mdp):
        if mdp in self.validate:
            print("Auth successful")
            return True
        else:
            print("Auth not valid, press Enter to try again")
            return False
